import { Field, InputType } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email: string;

  @Length(2, 255)
  @Field()
  firstName: string;

  @Length(2, 255)
  @Field()
  lastName: string;

  @Field()
  password: string;
}
