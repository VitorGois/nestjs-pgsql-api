import { Matches, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @MinLength(5)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least one uppercase, lowercase, number or symbol'
  })
  public password: string;

  @MinLength(5)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least one uppercase, lowercase, number or symbol'
  })
  public passwordConfirmation: string;
}