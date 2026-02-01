import {
  Controller,
  Get,
  Body,
  UseGuards,
  Put,
  Param,
  ParseIntPipe,
  ForbiddenException,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { User } from 'generated/prisma/client';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { MediaService } from 'src/media/media.service';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtGuard)
@Controller('api/users')
export class UserController {
  constructor(
    private usersService: UserService,
    private mediaService: MediaService,
  ) {}

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

  @Patch('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @GetUser('id') userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const media = await this.mediaService.uploadImage(file);

    return this.usersService.updateAvatar(userId, media.id);
  }
}
