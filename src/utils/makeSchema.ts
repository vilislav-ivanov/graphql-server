import { buildSchema } from 'type-graphql';
import { authChecker } from '../modules/utils/authChecker';

import Container from './makeContainer';

export const makeSchema = async () => {
  return buildSchema({
    resolvers: [__dirname + '/../modules/*/*.{ts,js}'],
    authChecker: authChecker,
    container: Container,
  });
};
