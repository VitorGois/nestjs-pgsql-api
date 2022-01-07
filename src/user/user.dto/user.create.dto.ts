import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(200)
  public email: string;

  @IsNotEmpty()
  @MaxLength(200)
  public name: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(32)
  public password: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(32)
  public passwordConfirmation: string;
}
