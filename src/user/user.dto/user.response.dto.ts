import { User } from '../user.entity';

export class UserResponseDto {
  public user: User;
  public message: string;
}
