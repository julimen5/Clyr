import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export const seed = async () =>
  prisma.hierarchyRequirement
    .createMany({
      data: [
        {
          id: 'ecc3184d-41be-4228-8e56-13ea6d6a5483',
          policyId: 'ecc3184d-41be-4228-8e56-13ea6d6a5481',
          hierarchy: 0,
          minApprovers: 2,
        },
        {
          id: 'ecc3184d-41be-4228-8e56-13ea6d6a5482',
          policyId: 'ecc3184d-41be-4228-8e56-13ea6d6a5481',
          hierarchy: 1,
          minApprovers: 1,
        },
      ],
    })
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
