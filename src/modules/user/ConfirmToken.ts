import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { User } from '../../entity/User';
import { MyContext } from 'src/modules/types/MyContext';

@Resolver(() => User)
export class ConfirmTokenResolver {
  @Mutation(() => User, { nullable: true })
  async confirmAccount(
    @Arg('confirmToken') confirmToken: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<User | null> {
    const userId = await redis.get(confirmToken);

    if (!userId) return null;

    const user = await User.findOne(userId);

    if (!user) return null;
    user.confirmed = true;

    req.session.userId = user.id;

    await redis.del(confirmToken);

    await user.save();
    return user;
  }
}
