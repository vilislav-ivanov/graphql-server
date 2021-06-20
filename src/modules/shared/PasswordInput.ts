import { Field, InputType } from 'type-graphql';
import { MinLength } from 'class-validator';

@InputType()
export class PasswordInput {
  @MinLength(5)
  @Field()
  password: string;
}
