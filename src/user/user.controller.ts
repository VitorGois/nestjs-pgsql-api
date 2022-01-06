import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/auth.decorators';
import { RolesGuard } from 'src/auth/auth.guards';
import { UserCreateDto, UserResponseDto } from './user.dto';
import { UserRole } from './user.enum';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

  @Post()
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
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
