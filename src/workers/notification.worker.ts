import { Worker } from 'bullmq';
import { redisConnection as connection } from '@/redis/config.redis';
import { sendNotificationWorker } from '@/services/notificaction.service';

export const notificationWorker = new Worker(
  'Notifications',
  async (job) => {
    const { html, users } = job.data;
    return sendNotificationWorker(html, users);
  },
  {
    connection,
  },
);

notificationWorker.on('failed', (job, err) => {
  console.error(`Job failed with error ${err.message}`);
});

notificationWorker.on('active', (job) => {
  console.log(`Processing job ${job.id}`);
});
