import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCreateDto } from 'src/user/user.dto';
import { UserRole } from 'src/user/user.enum';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { AuthLoginDto, ChangePasswordDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth.interface/auth.jwt.payload';
import { MailService } from 'src/mail/mail.service';
import { Logger } from 'winston';
import * as crypto from 'crypto';

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

  public async confirmEmail(confirmationToken: string): Promise<void> {
    const result = await this.userRepository.update(
      { confirmationToken },
      { confirmationToken: null },
    );

    if (result.affected === 0) throw new NotFoundException('Invalid token');
  }

  public async sendRecoverPasswordEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ email });

    if (!user) throw new NotFoundException('User not found');

    user.recoverToken = crypto.randomBytes(32).toString('hex');
    await user.save();

    try {
      await this.mailService.sendRecoverPasswordMail(user);
    } catch (err) {
      this.logger.warn('Failed to send recover password mail\n', err);
    }
  }

  public async resetPassword(recoverToken: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findOne(
      { recoverToken },
      { select: ['id'] },
    );

    if (!user) throw new NotFoundException('Invalid token');

    try {
      await this.changePassword(user.id.toString(), changePasswordDto);
    } catch (err) {
      throw err;
    }
  }

  public async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { password, passwordConfirmation } = changePasswordDto;

    if (password != passwordConfirmation)
      throw new UnprocessableEntityException('Password do not match');

    await this.userRepository.changePassword(id, password);
  }
}
