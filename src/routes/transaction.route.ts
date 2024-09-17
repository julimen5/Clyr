import express from 'express';
import {
  changeStatusTransaction,
  processTransactionWebhook,
} from '@/controllers/transaction.controller';
import { userMiddleware } from '@/middlewares/user.middleware';
import { validateRequest } from '@/middlewares/validators/schema.validator';
import { changeTransactionStatusSchema } from '@/middlewares/validators/schemas/transaction-status.schema';
import { createWebhookSchema } from '@/middlewares/validators/schemas/webhook.schema';

export const router = express.Router();

router.post(
  '/webhooks',
  validateRequest(createWebhookSchema),
  processTransactionWebhook,
);

router.post(
  '/:transactionId/status',
  // Simulating a token/JWT middleware
  userMiddleware,
  validateRequest(changeTransactionStatusSchema),
  changeStatusTransaction,
);
