import type { Prisma } from '@prisma/client';

type TransactionEntityRelations = {
  approvalRequests: true;
  card: true;
  team: true;
};

export type TransactionEntity = Prisma.TransactionGetPayload<{
  include: TransactionEntityRelations;
}>;
export type TransactionWhereInput = Prisma.TransactionWhereInput;
export type TransactionInclude = Prisma.TransactionInclude;
