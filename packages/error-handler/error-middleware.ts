import { AppError } from './index';
import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: any, // Change from Error to any to catch all error types
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the full error for debugging
  console.error("Error caught by middleware:", err);

  if (err instanceof AppError) {
    console.log(`Error ${req.method} ${req.url} - ${err.message}`);
    return res.status(err.statusCode).json({
      status: "Error",
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Handle standard Error objects
  if (err instanceof Error) {
    return res.status(500).json({
      error: "Something went wrong, please try again!",
      message: err.message,
    });
  }

  // Handle non-Error objects (like IncomingMessage)
  console.error("Unhandled non-Error object:", err);
  return res.status(500).json({
    error: "Something went wrong, please try again!",
  });
};
