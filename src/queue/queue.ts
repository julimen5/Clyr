// Reuse the ioredis instance
import { Queue } from 'bullmq';
import { redisConnection as connection } from '@/redis/config.redis';

export const transactionQueue = new Queue('QueueTransaction', { connection });
export const notificationsQueue = new Queue('Notifications', { connection });
