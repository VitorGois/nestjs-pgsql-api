import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  ValidationPipe,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, Role } from 'src/auth/auth.decorators';
import { RolesGuard } from 'src/auth/auth.guards';
import { UserCreateDto, UserResponseDto, UserUpdateDto } from './user.dto';
import { User } from './user.entity';
import { UserRole } from './user.enum';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
  public constructor(private usersService: UserService) { }

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

  @Patch(':id')
  public async updateUser(
    @Body(ValidationPipe) userUpdateDto: UserUpdateDto, 
    @GetUser() user: User, // extract from token
    @Param('id') id: string
  ): Promise<User> {
    console.log(JSON.stringify(user));
    if (user.role !== UserRole.ADMIN && user.id.toString() !== id) {
      throw new ForbiddenException('Unauthorized to access this feature.')
    } else {
      return this.usersService.updateUser(userUpdateDto, id);
    }
  }
}
