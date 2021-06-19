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
import { RegisterInput } from './register/RegisterInput';

@Resolver(() => User)
export class RegisterResolver {
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
    @Arg('data') { email, firstName, lastName, password }: RegisterInput
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
