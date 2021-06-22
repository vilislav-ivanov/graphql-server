import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { User } from '../../entity/User';
import { MyContext } from 'src/modules/types/MyContext';
import { Redis } from 'ioredis';
import { Inject, Service } from 'typedi';

@Service()
@Resolver(() => User)
export class ConfirmTokenResolver {
  @Inject('redis')
  private readonly redis: Redis;

  @Mutation(() => User, { nullable: true })
  async confirmAccount(
    @Arg('confirmToken') confirmToken: string,
    @Ctx() { req }: MyContext
  ): Promise<User | null> {
    const userId = await this.redis.get(confirmToken);

    if (!userId) return null;

    const user = await User.findOne(userId);

    if (!user) return null;
    user.confirmed = true;

    req.session.userId = user.id;

    await this.redis.del(confirmToken);

    await user.save();
    return user;
  }
}
