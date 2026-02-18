import { Response } from 'express';

export const sendSuccess = (res: Response, data: unknown, statusCode = 200, message?: string) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res: Response, message: string, statusCode = 500, errors?: string[]) => {
  const body: Record<string, unknown> = { message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};
