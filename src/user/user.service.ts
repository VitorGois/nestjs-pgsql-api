import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
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

  public async createAdminUser(UserCreateDto: UserCreateDto): Promise<User> {
    if (UserCreateDto.password != UserCreateDto.passwordConfirmation) {
      throw new UnprocessableEntityException('Passwords do not match');
    } else {
      return this.userRepository.createUser(UserCreateDto, UserRole.ADMIN);
    }
  }

  public async findUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne(userId, {
      select: [ 'email', 'name', 'role', 'id']
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }
}
