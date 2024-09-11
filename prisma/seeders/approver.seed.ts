import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const seed = async () =>
    prisma.approver.createMany({
        data: [{
            id: "ecc3184d-41be-4228-8e56-13ea6d6a5483",
            userId: "ecc3184d-41be-4228-8e56-13ea6d6a5483",
            policyId: "ecc3184d-41be-4228-8e56-13ea6d6a5481",
        },{
            id: "ecc3184d-41be-4228-8e56-13ea6d6a5482",
            role: "APPROVER",
            policyId: "ecc3184d-41be-4228-8e56-13ea6d6a5481",
        }],
    }).then(async () => {
    await prisma.$disconnect()
})
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

