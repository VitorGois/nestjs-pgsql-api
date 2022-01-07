import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserCreateDto } from 'src/user/user.dto';
import { User } from 'src/user/user.entity';
import { UserRole } from 'src/user/user.enum';
import { GetUser } from './auth.decorators';
import { AuthLoginDto, ChangePasswordDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) { }

  @Post('signup')
  public async signUp(
    @Body(ValidationPipe) userCreateDto: UserCreateDto,
  ): Promise<{ message: string }> {
    await this.authService.signUp(userCreateDto);

    return {
      message: 'Successfully user signup',
    };
  }

  @Post('signin')
  public async signIn(
    @Body(ValidationPipe) userLoginDto: AuthLoginDto,
  ): Promise<{ token: string }> {
    return this.authService.signIn(userLoginDto);
  }

  @Patch(':token')
  @HttpCode(200)
  public async confirmEmail(@Param('token') token: string): Promise<void> {
    await this.authService.confirmEmail(token);
  }

  @Post('send-recover-email')
  public async sendRecoverPasswordEmail(
    @Body('email') email: string,
  ): Promise<{ message: string }> {
    await this.authService.sendRecoverPasswordEmail(email);
    return {
      message: 'Email has sent with password recovery steps'
    }
  }

  @Patch('/reset-password/:token')
  public async resetPassword(
    @Param('token') token: string,
    @Body(ValidationPipe) changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(token, changePasswordDto);

    return {
      message: 'Password has been reset successfully',
    };
  }

  @Get('profile')
  @UseGuards(AuthGuard())
  getMe(@GetUser() user: User): User {
    return user;
  }
}
