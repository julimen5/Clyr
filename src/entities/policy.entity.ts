import type { Prisma } from '@prisma/client';

type PolicyEntityRelations = {
  team: true;
  conditions: true;
  approvers: true;
  hierarchyRequirements: true;
};

export type PolicyEntity = Prisma.PolicyGetPayload<{
  include: PolicyEntityRelations;
}>;
export type PolicyWhereInput = Prisma.PolicyWhereInput;
export type PolicyInclude = Prisma.PolicyInclude;
