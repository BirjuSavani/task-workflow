import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as taskService from '../services/taskService';
import { sendSuccess } from '../utils/response';
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  requestTaskFiltersSchema
} from '../validators/task.validator';

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const data = createTaskSchema.parse(req.body);
    const task = await taskService.createTask(userId, data);
    sendSuccess(res, task, 201, 'Task created successfully');
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { page, limit, status } = requestTaskFiltersSchema.parse(req.query);
    const result = await taskService.getTasks(userId, status, page, limit);
    sendSuccess(res, result, 200, 'Tasks retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const taskId = req.params.taskId as string;
    const data = updateTaskSchema.parse(req.body);
    const task = await taskService.updateTask(taskId, userId, data);
    sendSuccess(res, task, 200, 'Task updated successfully');
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const taskId = req.params.taskId as string;
    const { status } = updateTaskStatusSchema.parse(req.body);
    const task = await taskService.updateTaskStatus(taskId, userId, status);
    sendSuccess(res, task, 200, 'Task status updated successfully');
  } catch (error) {
    next(error);
  }
};
