import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const brands = await this.prisma.brand.findMany();

    return brands.map((b) => ({
      id: b.id,
      attributes: {
        name: b.name,
      },
    }));
  }
}
