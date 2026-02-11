import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SizesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const sizes = await this.prisma.size.findMany();

    return sizes.map((s) => ({
      id: s.id,
      attributes: {
        value: s.name.toString(),
      },
    }));
  }
}
