import { Redis } from 'ioredis';
import { AuthRequest } from './AuthRequest';

export interface MyContext {
  req: AuthRequest;
  redis: Redis;
}
