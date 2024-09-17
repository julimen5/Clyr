import { NotFoundException } from '@/exceptions/exception';
import prisma from '@/database/prisma.database';
import {
  PolicyEntity,
  PolicyInclude,
  PolicyWhereInput,
} from '@/entities/policy.entity';
import { ApproverEntity } from '@/entities/approver.entity';
import { Prisma } from '@prisma/client';
import { findTeamById } from '@/services/team.service';
import { findApprover } from '@/services/approvers.service';

export const createPolicy = async (createPolicy: PolicyEntity) => {
  const team = await findTeamById(createPolicy.teamId);
  if (!team) {
    throw new NotFoundException('Team');
  }
  await validateApprovers(createPolicy.approvers as ApproverEntity[]);
  return prisma.policy.create({
    data: {
      ...createPolicy,
      ...(createPolicy.conditions.length && {
        conditions: { create: createPolicy.conditions },
      }),
      ...(createPolicy.hierarchyRequirements.length && {
        hierarchyRequirements: { create: createPolicy.hierarchyRequirements },
      }),
      ...(createPolicy.approvers.length && {
        approvers: { create: createPolicy.approvers },
      }),
    },
    include: {
      conditions: true,
      approvers: true,
      hierarchyRequirements: true,
    },
  } as unknown as Prisma.PolicyCreateArgs);
};

export const validateApprovers = async (approvers: ApproverEntity[]) => {
  try {
    const approversPromises = approvers.map((approver) =>
      findApprover(approver),
    );
    // if only one approver is not found it will throw an exception
    await Promise.all(approversPromises);
  } catch (e) {
    console.error(e);
    throw new NotFoundException('Approver');
  }
};

export const findPolicies = async (
  where: PolicyWhereInput,
  include: PolicyInclude,
) => {
  return prisma.policy.findMany({
    where,
    include,
  });
};
