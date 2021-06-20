import { MyContext } from '../types/MyContext';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';

import { User } from '../../entity/User';
import { sendResetPasswordMail } from '../utils/sendResetPasswordMail';
import { ChangePasswordInput } from './changePassword/ChangePasswordInput';

@Resolver(() => User)
export class ChangePasswordResolver {
  @Mutation(() => Boolean)
  async requestResetPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext
  ): Promise<Boolean> {
    const user = await User.findOne({ where: { email } });
    if (!user) return false;

    const token = v4();

    await redis.set(token, user.id, 'EX', 60 * 60); // 1h for changing a password

    await sendResetPasswordMail(email, token);
    return true;
  }

  @Mutation(() => User, { nullable: true })
  async changePassword(
    @Arg('data') { changePasswordToken, password }: ChangePasswordInput,
    @Ctx() { redis, req }: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(changePasswordToken);
    await redis.del(changePasswordToken);

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
