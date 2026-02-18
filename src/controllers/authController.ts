import { NextFunction, Request, Response } from 'express';
import * as authService from '../services/authService';
import { sendSuccess } from '../utils/response';
import { AuthRequest } from '../middleware/auth';
import { registerSchema, loginSchema } from '../validators/auth.validator';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const result = await authService.register(name, email, password);
    sendSuccess(res, result, 201, 'User registered successfully');
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.login(email, password);
    sendSuccess(res, result, 200, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new Error('User not authenticated');
    
    const user = await authService.getProfile(userId);
    sendSuccess(res, user, 200, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};
