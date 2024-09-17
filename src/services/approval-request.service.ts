import prisma from '@/database/prisma.database';
import {
  ApprovalRequestCreateManyInput,
  ApprovalRequestEntity,
  ApprovalRequestInclude,
  ApprovalRequestWhereInput,
} from '@/entities/approval-request.entity';

export const updateManyApprovalTransaction = async (
  where: ApprovalRequestWhereInput,
  data: Partial<ApprovalRequestEntity>,
) => {
  return prisma.approvalRequest.updateMany({ where, data });
};

export const createManyApprovalTransaction = async (
  data: ApprovalRequestCreateManyInput[],
) => {
  return prisma.approvalRequest.createMany({ data });
};

export const findManyApprovalRequests = async (
  where: ApprovalRequestWhereInput,
  include?: ApprovalRequestInclude | null,
) => {
  return prisma.approvalRequest.findMany({ where, include });
};
