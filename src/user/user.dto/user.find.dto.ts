import { BaseQueryParametersDto } from 'src/shared/dto';
import { User } from '../user.entity';
import { UserRole } from '../user.enum';

export class FindUserQueryDto extends BaseQueryParametersDto {
  public name: string;
  public email: string;
  public status: boolean;
  public role: UserRole;
}

export class UsersFoundDto {
  public users: User[];
  public total: number;
}