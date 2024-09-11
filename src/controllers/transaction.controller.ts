import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const approveTransaction = async (req: Request, res: Response) => {
  const { transactionId } = req.params;
  const { approverId } = req.query;
  // const { user } = res.locals;
  const user = await prisma.user.findUnique({
    where: { id: 'ecc3184d-41be-4228-8e56-13ea6d6a5483' },
  });
  console.log(user);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  const transaction = await prisma.transaction.findUnique({
    where: {
      id: transactionId,
    },
    include: {
      approvalRequests: {
        where: {
          approverId: approverId as string,
        },
        include: {
          approver: true,
        },
      },
    },
  });
  if (!transaction || transaction.status !== 'PENDING') {
    return res.status(404).json({ message: 'Transaction not found' });
  }
  const approver = transaction.approvalRequests.find(
    (approvalRequest) =>
      (approvalRequest.approver.userId === user.id &&
        approvalRequest.approver.role === null) ||
      (approvalRequest.approver.role === user.role &&
        approvalRequest.approver.userId === null),
  );
  if (!approver) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res.json(transaction);
};
