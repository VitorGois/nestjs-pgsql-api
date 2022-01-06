import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class AuthLoginDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(200)
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
