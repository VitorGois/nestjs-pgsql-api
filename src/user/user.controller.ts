import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/auth/auth.decorators';
import { RolesGuard } from 'src/auth/auth.guards';
import { UserCreateDto, UserResponseDto } from './user.dto';
import { UserRole } from './user.enum';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
  public constructor(private usersService: UserService) {}

  @Post()
  @Role(UserRole.ADMIN)
  public async createAdminUser(
    @Body(ValidationPipe) userCreateDto: UserCreateDto,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.createAdminUser(userCreateDto);
    return {
      user,
      message: 'Successfully signup admin',
    };
  }

  @Get(':id')
  @Role(UserRole.ADMIN)
  public async getUserById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findUserById(id);
    return {
      user,
      message: 'User found',
    };
  }
}
