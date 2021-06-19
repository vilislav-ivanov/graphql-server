import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import bcrypt from 'bcrypt';

import { User } from '../../entity/User';
import { MyContext } from 'src/types/MyContext';

@Resolver(() => User)
export class LoginResolver {
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
