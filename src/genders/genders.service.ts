import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GendersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const genders = await this.prisma.gender.findMany();

    return genders.map((g) => ({
      id: g.id,
      attributes: {
        name: g.name,
      },
    }));
  }
}
