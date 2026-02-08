import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateAvatar(userId: number, mediaId: number) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        avatarId: mediaId,
      },
      include: {
        avatar: true,
      },
    });

    delete user.password;
    return user;
  }

  async updateProfile(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
      },
      include: {
        avatar: true,
      },
    });

    delete user.password;
    return user;
  }
}
