import { AppError } from '../middleware/errorHandler';
import { User } from '../models';
import Task from '../models/Task';
import { addEmailJob } from '../queues/emailQueue';
import { addReportJob } from '../queues/reportQueue';
import { cacheGet, cacheInvalidate, cacheSet } from './cacheService';

export const createTask = async (userId: string, data: { title: string; description?: string; priority: 'LOW' | 'MEDIUM' | 'HIGH' }) => {
  const task = await Task.create({ ...data, userId });
  await cacheInvalidate(`tasks:${userId}:*`);
  return task;
};

export const getTasks = async (
  userId: string,
  status?: string,
  page = 1,
  limit = 10
) => {
  const cacheKey = `tasks:${userId}:${status || 'all'}:${page}:${limit}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return JSON.parse(cached);

  const where: Record<string, unknown> = { userId };
  if (status) where.status = status;

  const offset = (page - 1) * limit;
  const { count, rows } = await Task.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  const result = {
    tasks: rows,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };

  await cacheSet(cacheKey, JSON.stringify(result), 60);
  return result;
};

export const updateTask = async (
  taskId: string,
  userId: string,
  data: { title?: string; description?: string; priority?: 'LOW' | 'MEDIUM' | 'HIGH'; status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' }
) => {
  const task = await Task.findByPk(taskId);
  if (!task) throw new AppError('Task not found', 404);
  if (task.userId !== userId) throw new AppError('Forbidden', 403);
  if (data.title !== undefined && !data.title.trim()) {
    throw new AppError('Title cannot be empty', 400);
  }

  await task.update(data);
  await cacheInvalidate(`tasks:${userId}:*`);
  return task;
};

export const updateTaskStatus = async (
  taskId: string,
  userId: string,
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
) => {
  const task = await Task.findByPk(taskId);
  if (!task) throw new AppError('Task not found', 404);
  if (task.userId !== userId) throw new AppError('Forbidden', 403);

  await task.update({ status });
  await cacheInvalidate(`tasks:${userId}:*`);

  // Get user for email
  const user = await User.findByPk(userId, { attributes: ['id', 'name', 'email'] });

  // Enqueue email job
  await addEmailJob('task-status-email', { user, task: task.toJSON() });

  // Enqueue report job if COMPLETED or FAILED
  if (status === 'COMPLETED' || status === 'FAILED') {
    await addReportJob('generate-report', { userId, taskId, status });
  }

  return task;
};
