import {z } from "zod";

export const createWebhookSchema = z.object({
    merchant: z.string(),
    amount: z.number(),
    //datetime: z.date(),
    cardId: z.string().uuid(),
    teamId: z.string().uuid(),
});


// {
//     merchant: "Home Depot",
//         amount: 10000, //amount are in cents so this is $100
//     datetime: "2024-09-06T19:33:56Z",
//     cardId: "card_15863000-810c-4448-944d-394c4ceb6948", //this is a UUID of the card enrolled
//     teamId: "team_2db0b939-a3e5-4c5e-a87c-23304e48396a", //team is like a tenant. Certain clients will have more than one tenant
// }
