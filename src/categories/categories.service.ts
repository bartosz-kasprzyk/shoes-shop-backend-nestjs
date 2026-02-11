import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.category.findMany();

    return categories.map((c) => ({
      id: c.id,
      attributes: {
        name: c.name,
      },
    }));
  }
}
