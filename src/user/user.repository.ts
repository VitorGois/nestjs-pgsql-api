import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FindUserQueryDto, UsersFoundDto, UserCreateDto } from './user.dto';
import { UserRole } from './user.enum';
import { AuthLoginDto } from 'src/auth/auth.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async createUser(
    UserCreateDto: UserCreateDto,
    role: UserRole,
  ): Promise<User> {
    const { email, name, password } = UserCreateDto;

    const user = this.create();
    user.email = email;
    user.name = name;
    user.role = role;
    user.status = true;
    user.confirmationToken = crypto.randomBytes(32).toString('hex');
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
      delete user.password;
      delete user.salt;
      return user;
    } catch (error) {
      const uniqueConstraintViolatedPgCode = '23505';
      if (error.code.toString() === uniqueConstraintViolatedPgCode) {
        throw new ConflictException('Email address already in use');
      } else {
        throw new InternalServerErrorException('Error saving user to database');
      }
    }
  }

  public async findUsers(queryDto: FindUserQueryDto): Promise<UsersFoundDto> {
    queryDto.status = queryDto.status || true;
    queryDto.page = queryDto.page < 1 ? 1 : queryDto.page;
    queryDto.limit = queryDto.limit > 100 ? 100 : queryDto.limit;

    const { email, name, status, role } = queryDto;
    const query = this.createQueryBuilder('user');
    query.where('user.status = :status', { status });

    if (email) {
      query.andWhere('user.email ILIKE :email', { email: `%${email}%` });
    }

    if (name) {
      query.andWhere('user.name ILIKE :name', { name: `%${name}%` });
    }

    if (role) {
      query.andWhere('user.role ILIKE :role', { role });
    }

    query.skip((queryDto.page - 1) * queryDto.limit);
    query.take(+queryDto.limit);
    query.orderBy(queryDto.sort ? JSON.parse(queryDto.sort) : undefined);
    query.select(['user.name', 'user.email', 'user.role', 'user.status']);

    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }

  public async checkCredentials(userCredentials: AuthLoginDto): Promise<User> {
    const { email, password } = userCredentials;
    const user = await this.findOne({ email, status: true });

    if (user && (await user.checkPassword(password))) {
      return user;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
