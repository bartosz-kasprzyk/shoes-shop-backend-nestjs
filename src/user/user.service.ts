import { Injectable, NotFoundException } from '@nestjs/common';
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
        avatar:
          avatar === null
            ? { disconnect: true }
            : avatar?.id
              ? { connect: { id: avatar.id } }
              : undefined,
      },
      include: {
        avatar: true,
      },
    });

    delete user.password;
    return user;
  }
}
