import { ZodIssue } from 'zod';

export class NotFoundException extends Error {
  constructor(entity: string) {
    super(`${entity} not found`);
  }
}

export class UnauthorizedException extends Error {
  constructor(user: string) {
    super(`${user} is unauthorized`);
  }
}

export class InvalidUserDataException extends Error {
  errors: ZodIssue[];
  constructor(errors: ZodIssue[]) {
    super('Invalid user data');
    this.errors = errors;
  }
}
