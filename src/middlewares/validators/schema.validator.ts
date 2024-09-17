// Middleware genérico de validación
import { NextFunction, Response, Request } from 'express';
import { ZodSchema } from 'zod';
import { InvalidUserDataException } from '@/exceptions/exception';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.safeParse(req.body);

    if (!validationResult.success) {
      next(new InvalidUserDataException(validationResult.error.errors));
    }
    next();
  };
};
