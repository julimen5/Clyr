import prisma from '@/database/prisma.database';
import { HierarchyRequirementWhereInput } from '@/entities/hierarchy-requirement.entity';

export const findManyHierarchyRequirements = async (
  where: HierarchyRequirementWhereInput,
) => {
  return prisma.hierarchyRequirement.findMany({ where });
};
