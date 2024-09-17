import { z } from 'zod';
import { TransactionStatus } from '@prisma/client';

export const changeTransactionStatusSchema = z.object({
  status: z.nativeEnum(TransactionStatus),
});
