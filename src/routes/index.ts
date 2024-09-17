import express from 'express';
import { router as policiesRouter } from '@/routes/policy.route';
import { router as transactionRouter } from '@/routes/transaction.route';

export const router = express.Router();

router.use('/policies', policiesRouter);
router.use('/transactions', transactionRouter);
