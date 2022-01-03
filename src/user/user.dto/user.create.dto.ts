import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(200)
  email: string;

  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @IsNotEmpty()
  @MinLength(5)
  password: string;

  @IsNotEmpty()
  @MinLength(5)
  passwordConfirmation: string;
}
