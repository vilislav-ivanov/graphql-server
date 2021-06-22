import { graphql, GraphQLSchema } from 'graphql';
import { makeSchema } from '../utils/makeSchema';
import { Maybe } from 'type-graphql';

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
  userId?: number;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues, userId }: Options) => {
  if (!schema) {
    schema = await makeSchema();
  }
  return graphql({
    schema,
    source: source,
    variableValues: variableValues,
    contextValue: {
      req: {
        session: {
          userId,
        },
      },
      res: {
        clearCookie: jest.fn(),
      },
    },
  });
};
