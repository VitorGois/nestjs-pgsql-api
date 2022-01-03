import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserCreateDto } from './user.dto';
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
