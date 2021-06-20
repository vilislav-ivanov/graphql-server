import { AuthChecker } from 'type-graphql';

export const authChecker: AuthChecker<any, any> | undefined = ({ context }) => {
  return !!context.req.session.userId;
};
