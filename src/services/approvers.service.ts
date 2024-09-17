import prisma from '@/database/prisma.database';
import {
  ApproverEntity,
  ApproverInclude,
  ApproverWhereInput,
} from '@/entities/approver.entity';

export const findApprover = (approver: ApproverEntity) => {
  return prisma.approver.findFirst({
    where: approver,
  });
};

export const findManyApprovers = async (
  where: ApproverWhereInput,
  include?: ApproverInclude,
) => {
  return prisma.approver.findMany({
    where,
    include,
  });
};
