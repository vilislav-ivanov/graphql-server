import { Field, InputType } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';
import { IsEmailAlreadyExist } from './IsEmailAlreadyExist';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  @IsEmailAlreadyExist({ message: 'email already exists' })
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
