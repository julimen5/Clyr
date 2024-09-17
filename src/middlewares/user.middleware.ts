import { NextFunction, Request, Response } from 'express';
import {
  NotFoundException,
  UnauthorizedException,
} from '@/exceptions/exception';
import prisma from '@/database/prisma.database';

export const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { headers } = req;
  const userId = headers['x-auth'];

  if (!userId) {
    return next(new UnauthorizedException(''));
  }
  const user = await prisma.user.findUnique({
    where: { id: userId as string },
  });

  if (!user) {
    return next(new NotFoundException('user'));
  }

  res.locals = { ...res.locals, user };
  next();
};
