import { graphql, GraphQLSchema } from 'graphql';
import { makeSchema } from '../utils/makeSchema';
import { Maybe } from 'type-graphql';

interface Options {
  source: string;
  variableValues?: Maybe<{
    [key: string]: any;
  }>;
}

let schema: GraphQLSchema;

export const gCall = async ({ source, variableValues }: Options) => {
  if (!schema) {
    schema = await makeSchema();
  }
  return graphql({
    schema,
    source: source,
    variableValues: variableValues,
  });
};
