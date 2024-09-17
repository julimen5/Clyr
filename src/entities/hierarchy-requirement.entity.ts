import type { Prisma } from '@prisma/client';

type HierarchyRequirementEntityRelations = {
  policy: true;
};

export type HierarchyRequirementEntity = Prisma.HierarchyRequirementGetPayload<{
  include: HierarchyRequirementEntityRelations;
}>;
export type HierarchyRequirementWhereInput =
  Prisma.HierarchyRequirementWhereInput;
export type HierarchyRequirementInclude = Prisma.HierarchyRequirementInclude;
