import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { avatar: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar
        ? {
            id: user.avatar.id,
            url: user.avatar.url,
          }
        : null,
    };
  }

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
    const { avatar, ...rest } = dto;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...rest,
        avatar: avatar?.id ? { connect: { id: avatar.id } } : undefined,
      },
      include: {
        avatar: true,
      },
    });

    delete user.password;
    return user;
  }
}
