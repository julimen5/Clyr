import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { Condition, PrismaClient, Transaction, User } from '@prisma/client';

const prisma = new PrismaClient();

export const processTransaction = async (req: Request, res: Response) => {
  const { body } = req;

  // Validating that the card actually exists for that team.
  const card = await prisma.card.findUnique({
    where: {
      id: body.cardId,
      teamId: body.teamId,
    },
    include: {
      user: true,
    },
  });
  if (!card) {
    return res.status(404).json({ error: 'Card not found' });
  }

  const transaction: Transaction = await prisma.transaction.create({
    data: {
      merchant: body.merchant,
      amount: body.amount,
      datetime: new Date(),
      cardId: body.cardId,
      teamId: body.teamId,
    },
  });

  const policies = await prisma.policy.findMany({
    where: {
      teamId: body.teamId,
    },
    include: {
      conditions: true,
      approvers: true,
    },
  });

  const applicablePolicies = policies.filter((policy) =>
    policy.conditions.every((condition) =>
      checkIfPolicyApplies(condition, transaction, card.user),
    ),
  );

  const approversPolicies = policies.flatMap((policy) =>
    policy.approvers.map((approver) => {
      return {
        transactionId: transaction.id,
        policyId: policy.id,
        approverId: approver.id,
      };
    }),
  );

  await prisma.approvalRequest.createMany({ data: approversPolicies });

  const approvers = await prisma.approver.findMany({
    where: {
      policyId: {
        in: applicablePolicies.map((policy) => policy.id),
      },
    },
    include: {
      user: true,
    },
  });

  const emails = [];
  for (const approver of approvers) {
    if (approver.user) {
      emails.push(approver.user.email);
    }
    if (approver.role) {
      const users = await prisma.user.findMany({
        where: { role: approver.role },
        select: { email: true },
      });
      emails.push(...users.map((user) => user.email));
    }
  }
  console.log(emails);
  const html = `A new transaction has been made by ${card.user.email} at ${transaction.merchant} for ${transaction.amount}`;
  await sendMail('me@me.com', emails, 'New Transaction', html);

  return res.json(applicablePolicies);
};

const checkIfPolicyApplies = (
  condition: Condition,
  transaction: Transaction,
  user: User,
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
  operator: string,
  conditionValue: string,
) => {
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
  operator: string,
  conditionValue: string,
) => {
  switch (operator) {
    case 'EQUALS':
      return transactionValue === conditionValue;
    default:
      return false;
  }
};

const sendMail = async (
  from: string,
  to: string[] | string,
  subject: string,
  html: string,
) => {
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '8f1539ec733b1b',
      pass: 'cf2247149a36ee',
    },
  });

  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};
