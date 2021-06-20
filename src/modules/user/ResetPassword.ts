import { MyContext } from '../../types/MyContext';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { v4 } from 'uuid';
import bcrypt from 'bcrypt';

import { User } from '../../entity/User';
import { sendResetPasswordMail } from '../utils/sendResetPasswordMail';

@Resolver(() => User)
export class ResetPasswordResolver {
  @Mutation(() => Boolean)
  async requestResetPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext
  ): Promise<Boolean> {
    // find if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return false;
    // generate token and send reset pass mail

    const token = v4();

    await redis.set(token, user.id, 'EX', 60 * 60); // 1h for resseting a password

    await sendResetPasswordMail(email, token);
    return true;
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Arg('resetPasswordToken') resetPasswordToken: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis }: MyContext
  ): Promise<Boolean> {
    const userId = await redis.get(resetPasswordToken);
    if (!userId) return false;

    const user = await User.findOne(userId);
    if (!user) return false;

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(newPassword, salt);

    user.password = hashedPass;
    await user.save();

    await redis.del(resetPasswordToken);

    return true;
  }
}
