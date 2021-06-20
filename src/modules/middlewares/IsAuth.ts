import { MyContext } from 'src/modules/types/MyContext';
import { MiddlewareFn } from 'type-graphql';

export const IsAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error('unauthorized');
  }
  return next();
};
