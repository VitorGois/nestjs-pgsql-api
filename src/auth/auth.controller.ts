import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserCreateDto } from 'src/user/user.dto';
import { User } from 'src/user/user.entity';
import { AuthLoginDto } from './auth.dto';
import { AuthService } from './auth.service';
import { GetUser } from './get-user.decorator';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getMe(@GetUser() user: User): User {
    return user;
  }
}
