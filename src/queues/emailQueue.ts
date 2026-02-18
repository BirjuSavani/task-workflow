import { Queue } from 'bullmq';
import env from '../config/env';

const connection = { host: env.REDIS_HOST, port: env.REDIS_PORT };

export const emailQueue = new Queue('email-queue', { connection });

export const addEmailJob = async (jobName: string, data: unknown) => {
  await emailQueue.add(jobName, data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  });
};
