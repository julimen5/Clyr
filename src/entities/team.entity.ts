import type { Prisma } from '@prisma/client';

type TeamEntityRelations = {
  users: true;
  cards: true;
  transactions: true;
  policies: true;
};

export type TeamEntity = Prisma.TeamGetPayload<{
  include: TeamEntityRelations;
}>;
export type TeamWhereInput = Prisma.TeamWhereInput;
export type TeamInclude = Prisma.TeamInclude;
