import { MyContext } from '../../types/MyContext';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { v4 } from 'uuid';

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
}
