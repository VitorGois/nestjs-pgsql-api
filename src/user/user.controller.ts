import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { UserCreateDto, UserResponseDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

  @Post()
  async createAdminUser(
    @Body(ValidationPipe) userCreateDto: UserCreateDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.createAdminUser(userCreateDto);
    return {
      user,
      message: 'Successfully signup admin',
    };
  }
}
