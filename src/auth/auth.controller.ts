import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserCreateDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';

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
}
