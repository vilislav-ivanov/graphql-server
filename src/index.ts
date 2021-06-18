import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';

import { Register } from './modules/user/Register';

const main = async () => {
  const schema = await buildSchema({ resolvers: [Register] });
  const apolloServer = new ApolloServer({ schema });
  await apolloServer.start();

  await createConnection();

  const app = express();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log('app up and running at http://localhost:4000/graphql');
  });
};

main();
