import { MyContext } from '../types/MyContext';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';

import { User } from '../../entity/User';
import { sendResetPasswordMail } from '../utils/sendResetPasswordMail';
import { ChangePasswordInput } from './changePassword/ChangePasswordInput';
import { Redis } from 'ioredis';
import { Inject, Service } from 'typedi';

@Service()
@Resolver(() => User)
export class ChangePasswordResolver {
  @Inject('redis')
  private readonly redis: Redis;

  @Mutation(() => Boolean)
  async requestResetPassword(@Arg('email') email: string): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) return false;

    const token = v4();

    await this.redis.set(token, user.id, 'EX', 60 * 60); // 1h for changing a password

    await sendResetPasswordMail(email, token);
    return true;
  }

  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg('data') { changePasswordToken, password }: ChangePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<User | null> {
    const userId = await this.redis.get(changePasswordToken);
    await this.redis.del(changePasswordToken);

    if (!userId) return null;

    const user = await User.findOne(userId);
    if (!user) return null;

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    user.password = hashedPass;
    await user.save();

    req.session.userId = user.id;

    return user;
  }
}
