import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const seed = async () =>
    prisma.condition.createMany({
        data: [{
            id: "ecc3184d-41be-4228-8e56-13ea6d6a5483",
            policyId: "ecc3184d-41be-4228-8e56-13ea6d6a5481",
            value: "ecc3184d-41be-4228-8e56-13ea6d6a5483",
            field: "cardId",
            operator: "EQUALS",
        },{
            id: "ecc3184d-41be-4228-8e56-13ea6d6a5481",
            policyId: "ecc3184d-41be-4228-8e56-13ea6d6a5481",
            value: "100",
            field: "amount",
            operator: "GREATER_THAN",
        }],
    }).then(async () => {
    await prisma.$disconnect()
})
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

