import {
  Controller,
  Get,
  Body,
  UseGuards,
  Put,
  Param,
  ParseIntPipe,
  ForbiddenException,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { User } from 'generated/prisma/client';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Put(':id')
  updateProfile(
    @Param('id', ParseIntPipe) userIdFromUrl: number,
    @GetUser('id') currentUserId: number,
    @Body() dto: UpdateUserDto,
  ) {
    if (userIdFromUrl !== currentUserId) {
      throw new ForbiddenException(
        'You are not allowed to update this profile',
      );
    }
    return this.usersService.updateProfile(currentUserId, dto);
  }
}
