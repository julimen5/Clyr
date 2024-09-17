import type { Prisma } from '@prisma/client';

type CardEntityRelations = {
  user: true;
  team: true;
  transactions: true;
};

export type CardEntity = Prisma.CardGetPayload<{
  include: CardEntityRelations;
}>;
export type CardWhereInput = Prisma.CardWhereInput;
export type CardInclude = Prisma.CardInclude;
export type CardWhereUniqueInput = Prisma.CardWhereUniqueInput;
