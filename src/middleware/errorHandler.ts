import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server xatosi';

  console.error(`Error: ${message}`);

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Ichki server xatosi' : message,
  });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ success: false, message: 'Marshrut topilmadi' });
}
