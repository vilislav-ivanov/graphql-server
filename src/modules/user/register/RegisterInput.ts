import { Field, InputType } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';
import { IsEmailAlreadyExist } from './IsEmailAlreadyExist';
import { PasswordInput } from '../../shared/PasswordInput';

@InputType()
export class RegisterInput extends PasswordInput {
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
}
