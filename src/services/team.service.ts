import prisma from '@/database/prisma.database';
import { TeamInclude } from '@/entities/team.entity';

export const findTeamById = async (teamId: string, include?: TeamInclude) => {
  return prisma.team.findUnique({ where: { id: teamId }, include });
};
