import { NextFunction, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as reportService from '../services/reportService';
import { sendSuccess } from '../utils/response';
import { generateReportSchema } from '../validators/report.validator';

export const getLatestReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const report = await reportService.getLatestReport(userId);
    sendSuccess(res, report, 200, 'Latest report retrieved');
  } catch (error) {
    next(error);
  }
};

export const generateReport = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { sendEmail } = generateReportSchema.parse(req.body);
    const result = await reportService.generateReport(userId, sendEmail);
    sendSuccess(res, result, 200, 'Report generation started');
  } catch (error) {
    next(error);
  }
};
