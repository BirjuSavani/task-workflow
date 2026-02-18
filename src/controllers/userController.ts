import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as authService from '../services/authService';
import { sendSuccess } from '../utils/response';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const user = await authService.getProfile(userId);
    sendSuccess(res, user, 200, 'User profile retrieved');
  } catch (error) {
    next(error);
  }
};
