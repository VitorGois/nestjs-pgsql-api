import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDto } from './user.dto';
import { UserRole } from './user.enum';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async createAdminUser(UserCreateDto: UserCreateDto): Promise<User> {
    if (UserCreateDto.password != UserCreateDto.passwordConfirmation) {
      throw new UnprocessableEntityException('Passwords do not match');
    } else {
      return this.userRepository.createUser(UserCreateDto, UserRole.ADMIN);
    }
  }
}
