import { Ctx, Mutation, Resolver } from 'type-graphql';

import { MyContext } from 'src/modules/types/MyContext';
import { Service } from 'typedi';

@Service()
@Resolver(() => Boolean)
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          resolve(false);
        }
        res.clearCookie('qid');
        resolve(true);
      });
    });
  }
}
