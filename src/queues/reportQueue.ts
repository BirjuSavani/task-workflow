import { Queue } from 'bullmq';
import env from '../config/env';

const connection = { host: env.REDIS_HOST, port: env.REDIS_PORT };

export const reportQueue = new Queue('report-queue', { connection });

export const addReportJob = async (jobName: string, data: unknown) => {
  await reportQueue.add(jobName, data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 },
  });
};
