import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const seed = async () =>
    prisma.approvalRequest.createMany({
        data: [{
            id: "ecc3184d-41be-4228-8e56-13ea6d6a5483",
            policyId: "ecc3184d-41be-4228-8e56-13ea6d6a5481",
            approverId: "ecc3184d-41be-4228-8e56-13ea6d6a5483",
            transactionId: "ecc3184d-41be-4228-8e56-13ea6d6a5483",
        }],
    }).then(async () => {
    await prisma.$disconnect()
})
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

