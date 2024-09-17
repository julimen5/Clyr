import { z } from 'zod';

export const createWebhookSchema = z.object({
  merchant: z.string(),
  amount: z.number(),
  //datetime: z.date(),
  cardId: z.string().uuid(),
  teamId: z.string().uuid(),
});
