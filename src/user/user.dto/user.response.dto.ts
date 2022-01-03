import { User } from '../user.entity';

export class UserResponseDto {
  user: User;
  message: string;
}
