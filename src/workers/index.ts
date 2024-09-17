import { transactionWorker } from '@/workers/transaction.workers';
import { notificationWorker } from '@/workers/notification.worker';

export const loadWorkers = () => {
  console.log('Loading workers...');
  console.log(transactionWorker.id);
  console.log(notificationWorker.id);
};
