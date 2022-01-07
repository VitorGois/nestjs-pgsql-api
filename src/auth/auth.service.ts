import {
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDto } from 'src/user/user.dto';
import { UserRole } from 'src/user/user.enum';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { AuthLoginDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.interface/auth.jwt.payload';
import { MailService } from 'src/mail/mail.service';
import { Logger } from 'winston';

@Injectable()
export class AuthService {
  public constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    @Inject('winston') private readonly logger: Logger,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  public async signUp(UserCreateDto: UserCreateDto): Promise<User> {
    const { password, passwordConfirmation } = UserCreateDto;

    if (password !== passwordConfirmation) {
      throw new UnprocessableEntityException('Passwords do not match');
    } else {
      const user = await this.userRepository.createUser(UserCreateDto, UserRole.USER);

      try {
        await this.mailService.sendConfirmationMail(user);
      } catch (err) {
        this.logger.warn('Failed to send confirmation mail\n', err);
      }

      return user;
    }
  }

  public async signIn(
    userCredentials: AuthLoginDto,
  ): Promise<{ token: string }> {
    const user = await this.userRepository.checkCredentials(userCredentials);

    if (user === null) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtPayload = {
      id: user.id,
    } as JwtPayload;
    const token = this.jwtService.sign(jwtPayload);

    return { token };
  }
}
