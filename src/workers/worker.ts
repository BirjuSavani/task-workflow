import dotenv from 'dotenv';
dotenv.config();

import { Job, Worker } from 'bullmq';
import sequelize from '../config/database';
import env from '../config/env';
import { JobLog, Report, Task, User } from '../models';
import { sendReportEmail, sendTaskEmail } from '../services/emailService';
import logger from '../utils/logger';

const connection = { host: env.REDIS_HOST, port: env.REDIS_PORT };

const logJob = async (
  job: Job,
  queueName: string,
  status: 'started' | 'completed' | 'failed',
  error?: string
) => {
  await JobLog.create({
    jobId: String(job.id),
    queueName,
    jobName: job.name,
    status,
    data: job.data as object,
    error,
  });
};

// ─── Email Worker ─────────────────────────────────────────────────────────────
const emailWorker = new Worker(
  'email-queue',
  async (job: Job) => {
    logger.info(`[email-queue] Job started: ${job.name}`, { jobId: job.id });
    await logJob(job, 'email-queue', 'started');

    const { user, task } = job.data;

    if (job.name === 'task-status-email') {
      await sendTaskEmail(user, task);
    } else if (job.name === 'report-email') {
      const { report } = job.data;
      await sendReportEmail(user, report);
    }

    logger.info(`[email-queue] Job completed: ${job.name}`, { jobId: job.id });
    await logJob(job, 'email-queue', 'completed');
  },
  { connection }
);

emailWorker.on('failed', async (job, err) => {
  if (job) {
    logger.error(`[email-queue] Job failed: ${job.name}`, { jobId: job.id, error: err.message });
    await logJob(job, 'email-queue', 'failed', err.message);
  }
});

// ─── Report Worker ────────────────────────────────────────────────────────────
const reportWorker = new Worker(
  'report-queue',
  async (job: Job) => {
    logger.info(`[report-queue] Job started: ${job.name}`, { jobId: job.id });
    await logJob(job, 'report-queue', 'started');

    const { userId, taskId, sendEmail: shouldSendEmail } = job.data;

    // Gather task stats for this user
    const tasks = await Task.findAll({ where: { userId } });
    const stats = {
      total: tasks.length,
      PENDING: tasks.filter((t) => t.status === 'PENDING').length,
      IN_PROGRESS: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
      COMPLETED: tasks.filter((t) => t.status === 'COMPLETED').length,
      FAILED: tasks.filter((t) => t.status === 'FAILED').length,
    };

    const reportContent = {
      generatedAt: new Date().toISOString(),
      stats,
      triggeredByTaskId: taskId || null,
    };

    const report = await Report.create({
      userId,
      taskId: taskId || undefined,
      type: 'task-summary',
      content: reportContent,
    });

    if (shouldSendEmail) {
      const user = await User.findByPk(userId, { attributes: ['id', 'name', 'email'] });
      if (user) {
        await sendReportEmail(
          { name: user.name, email: user.email },
          { type: report.type, content: reportContent }
        );
      }
    }

    logger.info(`[report-queue] Job completed: ${job.name}`, { jobId: job.id });
    await logJob(job, 'report-queue', 'completed');
  },
  { connection }
);

reportWorker.on('failed', async (job, err) => {
  if (job) {
    logger.error(`[report-queue] Job failed: ${job.name}`, { jobId: job.id, error: err.message });
    await logJob(job, 'report-queue', 'failed', err.message);
  }
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────
const startWorker = async () => {
  await sequelize.authenticate();
  logger.info('Worker DB connected');
  logger.info('Workers started: email-queue, report-queue');
};

startWorker().catch((err) => {
  logger.error('Worker startup failed', { error: err });
  process.exit(1);
});
