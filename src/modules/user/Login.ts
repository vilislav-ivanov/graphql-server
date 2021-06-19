import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import bcrypt from 'bcrypt';

import { User } from '../../entity/User';
import { MyContext } from 'src/types/MyContext';
import { IsAuth } from '../../middlewares/IsAuth';

@Resolver(() => User)
export class LoginResolver {
  // @Authorized()
  @UseMiddleware(IsAuth)
  @Query(() => User)
  async me(@Ctx() { req }: MyContext): Promise<User | null> {
    const user = await User.findOne(req.session.userId.toString());
    if (!user) throw new Error('no user found');
    return user;
  }

  @Mutation(() => User)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email } });

    if (!user) return null;

    const doMatch = bcrypt.compare(password, user.password);

    if (!doMatch) return null;

    req.session.userId = user.id;
    return user;
  }
}
