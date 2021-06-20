import { Request } from 'express';
import { Session } from 'express-session';

export type SessionWithUser = Session & { userId: string | {} };

export type AuthRequest = Request & {
  session?: SessionWithUser;
  auth?: { userId: string; permission_id: number };
};
