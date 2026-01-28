import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async updateProfile(userId: number, dto: UpdateUserDto) {
    const { avatar, ...rest } = dto;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...rest,
        avatarId: avatar?.id ?? undefined,
      },
    });

    delete user.password;
    return user;
  }
}
