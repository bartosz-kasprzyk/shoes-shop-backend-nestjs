import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ColorsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const colors = await this.prisma.color.findMany();

    return colors.map((c) => ({
      id: c.id,
      attributes: {
        name: c.name,
      },
    }));
  }
}
