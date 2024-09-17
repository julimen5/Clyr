import { NextFunction, Request, Response } from 'express';
import { createPolicy as createPolicyService } from '@/services/policy.service';
import { UnauthorizedException } from '@/exceptions/exception';

export const createPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { body } = req;
    const { user } = res.locals;
    if (user.teamId !== body.teamId) {
      throw new UnauthorizedException(user.email);
    }
    const policy = await createPolicyService(body);
    return res.status(201).json(policy);
  } catch (e) {
    next(e);
  }
};
