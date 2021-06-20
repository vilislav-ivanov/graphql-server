import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import { User } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { MyContext } from 'src/types/MyContext';
import { sendConfirmationMail } from '../utils/sendConfirmationMail';

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
    @Arg('data') { email, firstName, lastName, password }: RegisterInput,
    @Ctx() { redis }: MyContext
  ): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      firstName,
      lastName,
      password: hashedPass,
    }).save();

    // generate unique token and store it to redis as key with userId as value
    const token = v4();
    redis.set(token, user.id, 'EX', 60 * 60 * 24); // 24h expirations time
    // send mail with user email and token to generate unique link to confirm account
    await sendConfirmationMail(user.email, token);

    return user;
  }
}
