import { Query, Resolver } from 'type-graphql';

@Resolver()
export class Register {
  @Query(() => String)
  async hello() {
    return 'Hello World';
  }
}
