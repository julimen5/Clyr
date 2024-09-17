import prisma from '@/database/prisma.database';
import { CardInclude, CardWhereInput } from '@/entities/card.entity';

export const findCardById = async (
  id: string,
  where: CardWhereInput,
  include: CardInclude,
) => {
  const card = await prisma.card.findUnique({
    where: {
      ...where,
      id,
    },
    include,
  });

  return card;
};
