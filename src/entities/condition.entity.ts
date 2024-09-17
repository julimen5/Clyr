import type { Prisma } from '@prisma/client';

type ConditionEntityRelations = {
  policy: true;
};

export type ConditionEntity = Prisma.ConditionGetPayload<{
  include: ConditionEntityRelations;
}>;
export type ConditionWhereInput = Prisma.ConditionWhereInput;
export type ConditionInclude = Prisma.ConditionInclude;
