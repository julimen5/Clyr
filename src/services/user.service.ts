import prisma from '@/database/prisma.database';
import { UserWhereInput } from '@/entities/user.entity';

export const findManyUsers = async (where: UserWhereInput) => {
  return prisma.user.findMany({ where });
};
