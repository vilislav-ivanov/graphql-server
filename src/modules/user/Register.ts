import {
  Arg,
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
import { sendConfirmationMail } from '../utils/sendConfirmationMail';
import { Inject, Service } from 'typedi';
import { Redis } from 'ioredis';

@Service()
@Resolver(() => User)
export class RegisterResolver {
  @Inject('redis')
  private readonly redis: Redis;
  @Query(() => String)
  async hello() {
    console.log(this.redis);
    return 'Hello World!';
  }

  @FieldResolver(() => String)
  name(@Root() parent: User) {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Mutation(() => Boolean)
  async register(
    @Arg('data') { email, firstName, lastName, password }: RegisterInput
  ): // @Ctx() { redis }: MyContext
  Promise<Boolean> {
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
    this.redis.set(token, user.id, 'EX', 60 * 60 * 24); // 24h expirations time
    // send mail with user email and token to generate unique link to confirm account
    await sendConfirmationMail(user.email, token);

    return true;
  }
}
