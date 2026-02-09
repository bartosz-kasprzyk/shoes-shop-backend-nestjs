import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GendersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.gender.findMany();
  }
}
