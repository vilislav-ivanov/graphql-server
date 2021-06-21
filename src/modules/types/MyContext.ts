import { Response } from 'express';
import { Redis } from 'ioredis';
import { AuthRequest } from './AuthRequest';

export interface MyContext {
  req: AuthRequest;
  res: Response;
  redis: Redis;
}
