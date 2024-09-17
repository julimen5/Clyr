import type { Prisma } from '@prisma/client';

type ApprovalRequestEntityRelations = {
  policy: true;
  approver: true;
  transaction: true;
  approvedBy: true;
};

export type ApprovalRequestEntity = Prisma.ApprovalRequestGetPayload<{
  include: ApprovalRequestEntityRelations;
}>;
export type ApprovalRequestWhereInput = Prisma.ApprovalRequestWhereInput;
export type ApprovalRequestInclude = Prisma.ApprovalRequestInclude;
export type ApprovalRequestCreateManyInput =
  Prisma.ApprovalRequestCreateManyInput;
