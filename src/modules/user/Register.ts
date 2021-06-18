import {
  Arg,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import bcrypt from 'bcrypt';

import { User } from '../../entity/User';

@Resolver(() => User)
export class Register {
  @Query(() => String)
  async hello() {
    return 'Hello World!';
  }

  @FieldResolver(() => String)
  name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Mutation(() => User)
  async register(
    @Arg('firstName') firstName: string,
    @Arg('lastName') lastName: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPass,
    }).save();

    return user;
  }
}
