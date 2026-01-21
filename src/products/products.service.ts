import { Product } from './entities/product.entity';
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    const [brand, gender, category, color] = await Promise.all([
      this.prisma.brand.upsert({
        where: { name: createProductDto.brand },
        update: {},
        create: { name: createProductDto.brand },
      }),
      this.prisma.gender.upsert({
        where: { name: createProductDto.gender },
        update: {},
        create: { name: createProductDto.gender },
      }),
      this.prisma.category.upsert({
        where: { name: createProductDto.categories },
        update: {},
        create: { name: createProductDto.categories },
      }),
      this.prisma.color.upsert({
        where: { name: createProductDto.color },
        update: {},
        create: { name: createProductDto.color },
      }),
    ]);

    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        brandId: brand.id,
        colorId: color.id,
        genderId: gender.id,
        categoryId: category.id,
        userId: createProductDto.userID,
        // sizes: {
        //   connectOrCreate: createProductDto.sizes.map((sizeName) => ({
        //     where: { name: sizeName },
        //     create: { name: sizeName },
        //   })),
        // },
      },
    });

    return product;
  }

  async findAll() {
    const products = await this.prisma.product.findMany();
    return products;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
