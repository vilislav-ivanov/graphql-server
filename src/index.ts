import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import session from 'express-session';
import Redis from 'ioredis';
import connectRedis from 'connect-redis';

import { redisPass, sessionSecret } from '../config';
import { RegisterResolver } from './modules/user/Register';
import { LoginResolver } from './modules/user/Login';
import { ConfirmTokenResolver } from './modules/user/ConfirmToken';
import { ChangePasswordResolver } from './modules/user/ChangePassword';
import { authChecker } from './modules/utils/authChecker';

const main = async () => {
  const RedisStore = connectRedis(session);
  const redis = new Redis({ password: redisPass });
  const app = express();

  const schema = await buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      ConfirmTokenResolver,
      ChangePasswordResolver,
    ],
    authChecker: authChecker,
  });
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => ({
      req: req,
      redis: redis,
    }),
  });
  await apolloServer.start();

  await createConnection();

  app.use(
    session({
      store: new RedisStore({ client: redis }),
      secret: sessionSecret,
      name: 'qid',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      },
    })
  );

  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log('app up and running at http://localhost:4000/graphql');
  });
};

main();
