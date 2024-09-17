import type { Prisma } from '@prisma/client';

type ApproverEntityRelations = {
  policy: true;
  user: true;
  approvalRequests: true;
};

export type ApproverEntity = Prisma.ApproverGetPayload<{
  include: ApproverEntityRelations;
}>;
export type ApproverWhereInput = Prisma.ApproverWhereInput;
export type ApproverInclude = Prisma.ApproverInclude;
