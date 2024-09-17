import type { Prisma } from '@prisma/client';

type UserEntityRelations = {
  team: true;
  cards: true;
  approvers: true;
  approvalRequests: true;
};

export type UserEntity = Prisma.UserGetPayload<{
  include: UserEntityRelations;
}>;
// Tipos para where e include
export type UserWhereInput = Prisma.UserWhereInput;
export type UserInclude = Prisma.UserInclude;
