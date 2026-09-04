import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { AppError } from "../utils/appError.js";
import { config } from "../config/index.js";


interface DatabaseError extends Error {
    code?: string;
    details?: string;
}

export const globalErrorHandler: ErrorRequestHandler = (err: Error |AppError| DatabaseError, req: Request, res: Response, next: NextFunction ): void =>{
    let statusCode = 500;
    let message = 'Internal Server error';


    if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  else if ('code' in err && err.code === '23505') {
    statusCode = 409;
    message = (err as DatabaseError).details || 'Resource already exists';
  }
  else if ('code' in err && err.code === '23503') {
    statusCode = 400;
    message = (err as DatabaseError).details || 'Referenced resource does not exist';
  }
  else if (err instanceof Error) {
    message = err.message;
  }
  res.status(statusCode).json({
    success: false,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  });
}

