import { NextFunction, Request, Response } from 'express';
import {
  changeStatusTransaction as changeStatusTransactionService,
  processTransactionWebhook as processTransactionService,
} from '@/services/transaction.service';

export const changeStatusTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { transactionId } = req.params;
    const { approverId, policyId } = req.query;
    const { status } = req.body;
    const { user } = res.locals;
    // Only validating the body with the validator
    // But params and query should also be validated

    const transaction = await changeStatusTransactionService(
      transactionId as string,
      approverId as string,
      policyId as string,
      status,
      user,
    );
    return res.json(transaction);
  } catch (e) {
    next(e);
  }
};

export const processTransactionWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req;
    const transactionEntity = await processTransactionService(body);
    return res.json(transactionEntity);
  } catch (e) {
    next(e);
  }
};
