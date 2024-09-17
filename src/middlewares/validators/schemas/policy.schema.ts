import { z } from 'zod';
import { PolicyField, PolicyOperator } from '@prisma/client';

export const createPolicySchema = z
  .object({
    teamId: z.string().uuid(),
    isForAll: z.boolean().optional(),
    conditions: z
      .array(
        z.object({
          field: z.nativeEnum(PolicyField),
          operator: z.nativeEnum(PolicyOperator),
          value: z.string(), // @todo: when doing an amount validation, this should validate that the input is an actual number.
          // Using string even for numbers because of a simplicity on the database.
        }),
      )
      .optional(),
    hierarchyRequirements: z.array(
      z.object({
        hierarchy: z.number(),
        minApprovers: z.number(),
      }),
    ),
    approvers: z.array(
      z
        .object({
          userId: z.string().uuid().optional(),
          role: z.string().optional(),
          hierarchy: z.number(),
        })
        .refine(
          (data) => (data.userId && !data.role) || (!data.userId && data.role),
          {
            message: 'Only one is allowed',
            path: ['userId', 'role'],
          },
        ),
    ),
  })
  .refine(
    (data) => {
      if (data.isForAll) {
        return !data.conditions;
      }
      return true;
    },
    {
      message: 'Setting isForAll must have empty conditions.',
      path: ['conditions'],
    },
  );
