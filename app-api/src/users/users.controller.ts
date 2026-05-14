import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user-dto';

import { UserDto } from 'src/users/dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    return this.userService.create(body.email, body.password);
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    console.log('handler is running');
    return user;
  }

  @Get()
  getAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }
}
