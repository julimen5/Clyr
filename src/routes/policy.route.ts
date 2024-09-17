import express from 'express';
import { validateRequest } from '@/middlewares/validators/schema.validator';
import { createPolicySchema } from '@/middlewares/validators/schemas/policy.schema';
import { createPolicy } from '@/controllers/policy.controller';
import { userMiddleware } from '@/middlewares/user.middleware';

export const router = express.Router();

router.post(
  '',
  userMiddleware,
  validateRequest(createPolicySchema),
  createPolicy,
);
