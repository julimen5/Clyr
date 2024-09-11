import express from 'express';
import {processTransaction} from "@/controllers/webhook.controller";
import {createWebhookSchema} from "@/schemas/webhook.schema";
import {validateRequest} from "@/validators/schema.validator";

export const router = express.Router();

router.post('/', validateRequest(createWebhookSchema),processTransaction);
