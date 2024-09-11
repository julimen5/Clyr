import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const seed =  () => prisma.team.create({
        data: {
            // GENERATE A UUID FOR THE ID
            id: "ecc3184d-41be-4228-8e56-13ea6d6a5483",
            name: 'Team1',
        },
    })
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
