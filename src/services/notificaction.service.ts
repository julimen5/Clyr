import { sendMail } from '@/notifications/emails.notification';
import { User } from '@prisma/client';

export const sendNotificationWorker = async (html: string, users: User[]) => {
  // In this worker what could be added to handle multiple providers (emails/sms) is an array of providers and iterate
  // over it and calling each sender.
  await sendMail(
    'me@me.com',
    users.map((u) => u.email),
    'Notification from Clyr',
    html,
  );
};
