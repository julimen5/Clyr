import express from 'express';
import { approveTransaction } from '@/controllers/transaction.controller';

export const router = express.Router();

router.post('/:transactionId/approve', approveTransaction);
