import { notificationsQueue, transactionQueue } from '@/queue/queue';
import {
  PolicyOperator,
  PrismaClient,
  TransactionStatus,
} from '@prisma/client';
import {
  NotFoundException,
  UnauthorizedException,
} from '@/exceptions/exception';
import { UserEntity } from '@/entities/user.entity';
import {
  TransactionEntity,
  TransactionWhereInput,
} from '@/entities/transaction.entity';
import { CardEntity } from '@/entities/card.entity';
import { ConditionEntity } from '@/entities/condition.entity';
import { ApprovalRequestEntity } from '@/entities/approval-request.entity';
import { HierarchyRequirementEntity } from '@/entities/hierarchy-requirement.entity';
import { findCardById } from '@/services/card.service';
import {
  createManyApprovalTransaction,
  findManyApprovalRequests,
  updateManyApprovalTransaction,
} from '@/services/approval-request.service';
import { findPolicies } from '@/services/policy.service';
import { findManyApprovers } from '@/services/approvers.service';
import { findManyUsers } from '@/services/user.service';
import { findManyHierarchyRequirements } from '@/services/hierarchy-requirement.service';

const prisma = new PrismaClient();

export const changeStatusTransaction = async (
  transactionId: string,
  approverId: string,
  policyId: string,
  status: TransactionStatus,
  user: UserEntity,
) => {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
    include: {
      approvalRequests: {
        where: {
          approverId: approverId as string,
          policyId: policyId as string,
        },
        include: {
          approver: true,
          policy: true,
        },
      },
    },
  });
  if (!transaction || transaction.status !== 'PENDING') {
    throw new NotFoundException('transaction');
  }

  // This find here because Prisma doesn't allow me to use nested-nested-filter (The second include in above query)
  const approvalRequest = transaction.approvalRequests.find(
    (approvalRequest) =>
      (approvalRequest.approver.userId === user.id &&
        approvalRequest.approver.role === null) ||
      (approvalRequest.approver.role === user.role &&
        approvalRequest.approver.userId === null),
  );

  // This means that the user is not authorized to approve the transaction
  // Either because is not the approver or the approver is not in the same role
  if (!approvalRequest?.approver) {
    throw new UnauthorizedException(user.email);
  }

  // Here we are checking the isForAllCondition
  // If the policy is for everyone isForAll should be true, and then we should approve
  // All the other approvalRequests
  // If the isForAll is false then we should check the hierarchy of each approval.
  // If the hierarchy of the approver is lower than the current approver then we should approve
  // All the lower approval requests.
  const isForAllCondition = approvalRequest.policy.isForAll
    ? {}
    : {
        OR: [
          {
            approver: {
              hierarchy: {
                lt: approvalRequest.approver.hierarchy,
              },
            },
          },
          {
            approverId: approvalRequest.approverId,
          },
        ],
      };

  await updateManyApprovalTransaction(
    {
      transactionId: transactionId,
      policy: {
        id: approvalRequest.policyId,
      },
      ...isForAllCondition,
    },
    {
      status: status,
      approvedById: user.id,
    },
  );

  await transactionQueue.add(
    'processChangeStateTransaction',
    { transactionId, policyId },
    { delay: 5000 },
  );

  return transaction;
};

export const processTransactionWebhook = async (body: TransactionEntity) => {
  // Validating that the card actually exists for that team.
  const card = await findCardById(
    body.cardId,
    { teamId: body.teamId },
    {
      user: true,
    },
  );
  if (!card) {
    throw new NotFoundException('card');
  }

  const transaction: TransactionEntity = (await prisma.transaction.create({
    data: {
      merchant: body.merchant,
      amount: body.amount,
      datetime: new Date(),
      cardId: body.cardId,
      teamId: body.teamId,
    },
  })) as TransactionEntity;
  await transactionQueue.add('processWebhook', { transaction, card });
  return transaction;
};

export const processWebhookWorker = async (
  transaction: TransactionEntity,
  card: CardEntity,
) => {
  const policies = await findPolicies(
    { teamId: transaction.teamId },
    { conditions: true, approvers: true },
  );

  const applicablePolicies = policies.filter(
    (policy) =>
      policy.isForAll ||
      policy.conditions.every((condition) =>
        checkIfPolicyApplies(
          condition as ConditionEntity,
          transaction,
          card.user as UserEntity,
        ),
      ),
  );

  const approversPolicies = applicablePolicies.flatMap((policy) =>
    policy.approvers.map((approver) => {
      return {
        transactionId: transaction.id,
        policyId: policy.id,
        approverId: approver.id,
      };
    }),
  );

  console.log('approver policies', approversPolicies);

  await createManyApprovalTransaction(approversPolicies);
  const approvers = await findManyApprovers(
    {
      policyId: {
        in: applicablePolicies.map((policy) => policy.id),
      },
    },
    { user: true },
  );

  const users: UserEntity[] = [];
  for (const approver of approvers) {
    if (approver.user) {
      users.push(approver.user as UserEntity);
    }
    if (approver.role) {
      const usersToSend = await findManyUsers({ role: approver.role });
      users.push(...(usersToSend as UserEntity[]));
    }
  }

  // This should be moved to a template and then the notification should read the template and compile it
  // with a tool like EJS but for time purposes I will leave it like this
  const html = `A new transaction has been made by ${card.user?.email} at ${transaction.merchant} for ${transaction.amount}`;

  await notificationsQueue.add('sendNotification', {
    html,
    users,
  });
};

export const processTransactionChangeStateWorker = async ({
  transactionId,
  policyId,
}: {
  transactionId: string;
  policyId: string;
}) => {
  const approvalRequests = await findManyApprovalRequests(
    { transactionId },
    {
      policy: true,
      approver: true,
    },
  );

  // I'm assuming this can never happen
  // if (!approvalRequests.length) {
  //}

  await handleIsForAllCondition(approvalRequests, transactionId);

  const hierarchyApprovals = (await findManyHierarchyRequirements({
    policyId,
  })) as unknown as HierarchyRequirementEntity[];

  return processHierarchicalApprovalRequests(
    approvalRequests,
    hierarchyApprovals,
    transactionId,
  );
};

const updateTransaction = (
  data: Partial<TransactionEntity>,
  condition: TransactionWhereInput,
) => {
  return prisma.transaction.updateMany({
    where: condition,
    data,
  });
};

const checkIfPolicyApplies = (
  condition: ConditionEntity,
  transaction: TransactionEntity,
  user: UserEntity,
) => {
  switch (condition.field) {
    case 'amount':
      return checkAmountCondition(
        transaction.amount,
        condition.operator,
        condition.value,
      );
    case 'merchant':
    case 'cardId':
      return checkStringCondition(
        transaction[condition.field as 'merchant' | 'cardId'],
        condition.operator,
        condition.value,
      );
    case 'userId':
      return checkStringCondition(user.id, condition.operator, condition.value);
    default:
      return false;
  }
};

const checkAmountCondition = (
  transactionValue: number,
  operator: PolicyOperator,
  conditionValue: string,
) => {
  // Here is where the transformation of a string to number for when the field is amount
  const value = parseInt(conditionValue);
  switch (operator) {
    case 'EQUALS':
      return transactionValue === value;
    case 'GREATER_THAN':
      return transactionValue > value;
    case 'LESS_THAN':
      return transactionValue < value;
    default:
      return false;
  }
};

const checkStringCondition = (
  transactionValue: string,
  operator: PolicyOperator,
  conditionValue: string,
) => {
  switch (operator) {
    case 'EQUALS':
      return transactionValue === conditionValue;
    default:
      return false;
  }
};

const processHierarchicalApprovalRequests = (
  approvalRequests: ApprovalRequestEntity[],
  hierarchyRequirements: HierarchyRequirementEntity[],
  transactionId: string,
) => {
  const approvalsByHierarchy: Record<number, number> = {};
  const rejectionsByHierarchy: Record<number, number> = {};

  hierarchyRequirements.forEach((req) => {
    approvalsByHierarchy[req.hierarchy] = 0;
    rejectionsByHierarchy[req.hierarchy] = 0;
  });

  // Contar aprobaciones y rechazos por jerarquía
  approvalRequests.forEach((apRequest) => {
    const hierarchy = apRequest.approver.hierarchy;
    if (apRequest.status === 'APPROVED') {
      approvalsByHierarchy[hierarchy]++;
    } else if (apRequest.status === 'REJECTED') {
      rejectionsByHierarchy[hierarchy]++;
    }
  });

  // Verificar si se cumplen los requisitos de rechazo
  const isRejected = hierarchyRequirements.some(
    (req) => rejectionsByHierarchy[req.hierarchy] >= req.minApprovers,
  );

  if (isRejected) {
    return updateTransaction({ status: 'REJECTED' }, { id: transactionId });
  }

  // Verificar si se cumplen los requisitos de aprobación
  const isApproved = hierarchyRequirements.every(
    (req) => approvalsByHierarchy[req.hierarchy] >= req.minApprovers,
  );

  if (isApproved) {
    return updateTransaction({ status: 'APPROVED' }, { id: transactionId });
  }

  // Si no se cumple ninguna condición, la transacción queda pendiente
  return updateTransaction({ status: 'PENDING' }, { id: transactionId });
};

const handleIsForAllCondition = async (
  approvalRequests: ApprovalRequestEntity[],
  transactionId: string,
) => {
  // This means that the isForAllCondition is covered
  // It prioritize the rejection over the approval
  // if there is a rejection then the transaction should be rejected
  const approvedRequest = approvalRequests.some(
    (apRequest) => apRequest.policy.isForAll && apRequest.status === 'APPROVED',
  );

  const rejectedRequest = approvalRequests.some(
    (apRequest) => apRequest.policy.isForAll && apRequest.status === 'REJECTED',
  );

  if (rejectedRequest) {
    return updateTransaction({ status: 'REJECTED' }, { id: transactionId });
  } else if (approvedRequest) {
    return updateTransaction({ status: 'APPROVED' }, { id: transactionId });
  }
};
