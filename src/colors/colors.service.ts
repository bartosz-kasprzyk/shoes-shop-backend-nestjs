import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ColorsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.color.findMany();
  }
}
