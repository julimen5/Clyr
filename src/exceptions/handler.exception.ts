import { NextFunction, Request, Response } from 'express';
import {
  InvalidUserDataException,
  NotFoundException,
  UnauthorizedException,
} from '@/exceptions/exception';

export const handler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let httpCode = 500;
  let message = 'Something failed';
  let errors: any;
  if (err instanceof NotFoundException) {
    httpCode = 404;
    message = err.message;
  }
  if (err instanceof UnauthorizedException) {
    httpCode = 401;
    message = err.message;
  }

  if (err instanceof InvalidUserDataException) {
    httpCode = 400;
    message = err.message;
    errors = err.errors;
  }
  return res.status(httpCode).json({ error: true, httpCode, message, errors });
};
