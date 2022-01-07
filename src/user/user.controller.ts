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
  Delete,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, Role } from 'src/auth/auth.decorators';
import { RolesGuard } from 'src/auth/auth.guards';
import { FindUserQueryDto, UserCreateDto, UserResponseDto, UsersFoundDto, UserUpdateDto } from './user.dto';
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

  @Delete(':id')
  public async deleteUser(@Param('id') id: string): Promise<{ message: string; }> {
    await this.usersService.deleteUser(id);
    
    return { message: 'User removed successfully'}
  }

  @Get()
  @Role(UserRole.ADMIN)
  public async findUsers(@Query() query: FindUserQueryDto): Promise<UsersFoundDto> {
    return this.usersService.findUsers(query);
  }
}
