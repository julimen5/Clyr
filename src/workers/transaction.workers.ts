import { Worker } from 'bullmq';
import { redisConnection as connection } from '@/redis/config.redis';
import {
  processTransactionChangeStateWorker,
  processWebhookWorker,
} from '@/services/transaction.service';

export const transactionWorker = new Worker(
  'QueueTransaction',
  async (job) => {
    if (job.name === 'processWebhook')
      return processWebhookWorker(job.data.transaction, job.data.card);
    if (job.name === 'processChangeStateTransaction') {
      return processTransactionChangeStateWorker(job.data);
    }
  },
  {
    connection,
  },
);

transactionWorker.on('failed', (job, err) => {
  console.error(`Job failed with error ${err.message}`);
});

transactionWorker.on('active', (job) => {
  console.log(`Processing job ${job.id}`);
});
