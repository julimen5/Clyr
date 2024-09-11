import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const seed = () => prisma.user.createMany({
        data: [{
            id: "ecc3184d-41be-4228-8e56-13ea6d6a5483",
            name: 'User 1',
            teamId: "ecc3184d-41be-4228-8e56-13ea6d6a5483",
            email: "myEmailClyr1@mailinator.com",
            phone: "1234567890",
            role: "ADMIN",
        },{
            // GENERATE A UUID FOR THE ID
            id: "ecc3184d-41be-4228-8e56-13ea6d6a5482",
            name: 'User 2',
            teamId: "ecc3184d-41be-4228-8e56-13ea6d6a5483",
            email: "myEmailClyr2@mailinator.com",
            phone: "1234567891",
            role: "APPROVER",
        }],
    })
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
