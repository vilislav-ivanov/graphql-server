import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema, Query, Resolver } from 'type-graphql';

@Resolver()
class HelloWorld {
  @Query(() => String)
  async helloWorld() {
    return 'Hello world!';
  }
}

const main = async () => {
  const schema = await buildSchema({ resolvers: [HelloWorld] });
  const apolloServer = new ApolloServer({ schema });
  await apolloServer.start();

  const app = express();
  apolloServer.applyMiddleware({ app });
  app.listen(4000, () => {
    console.log('app up and running at http://localhost:4000/graphql');
  });
};

main();
