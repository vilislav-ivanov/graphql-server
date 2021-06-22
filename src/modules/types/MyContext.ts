import { Response } from 'express';
import { AuthRequest } from './AuthRequest';

export interface MyContext {
  req: AuthRequest;
  res: Response;
}
