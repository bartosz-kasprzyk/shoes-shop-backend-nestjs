import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const { sizes, images, userID, brand, categories, color, gender, ...rest } =
      createProductDto;

    return this.prisma.product.create({
      data: {
        ...rest,
        user: { connect: { id: +userID } },
        brand: { connect: { id: +brand } },
        category: { connect: { id: +categories } },
        color: { connect: { id: +color } },
        gender: { connect: { id: +gender } },
        sizes: {
          connect: sizes.map((id) => ({ id: +id })),
        },
        images: {
          create: images.map((img) => ({ url: img.url })),
        },
      },
      include: {
        images: true,
        sizes: true,
        brand: true,
        color: true,
        category: true,
        gender: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: {
        images: true,
        brand: true,
        category: true,
        color: true,
        gender: true,
        sizes: true,
      },
    });

    return products.map((p) => ({
      id: p.id,
      attributes: {
        name: p.name,
        price: Number(p.price),
        description: p.description,
        brand: { data: { id: p.brand.id } },
        color: { data: { id: p.color.id } },
        gender: { data: { id: p.gender.id } },
        categories: {
          data: [{ id: p.category.id }],
        },
        sizes: {
          data: p.sizes.map((s) => ({ id: s.id })),
        },
        images: {
          data: p.images.map((img) => ({
            id: img.id,
            attributes: { url: img.url },
          })),
        },
      },
    }));
  }

  async findOne(id: string) {
    const p = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        brand: true,
        sizes: true,
        color: true,
        category: true,
        gender: true,
      },
    });

    if (!p) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      id: p.id,
      attributes: {
        name: p.name,
        price: Number(p.price),
        description: p.description,
        brand: { data: { id: p.brand.id } },
        color: { data: { id: p.color.id } },
        gender: { data: { id: p.gender.id } },
        categories: { data: [{ id: p.category.id }] },
        sizes: { data: p.sizes.map((s) => ({ id: s.id })) },
        images: {
          data: p.images.map((img) => ({
            id: img.id,
            attributes: { url: img.url },
          })),
        },
      },
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const {
      sizes,
      images,
      brand,
      categories,
      color,
      gender,
      deletedImageIds,
      ...rest
    } = updateProductDto;

    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Product not found`);

    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(brand && { brand: { connect: { id: +brand } } }),
        ...(categories && { category: { connect: { id: +categories } } }),
        ...(color && { color: { connect: { id: +color } } }),
        ...(gender && { gender: { connect: { id: +gender } } }),
        ...(sizes && {
          sizes: {
            set: sizes.map((sizeId: number) => ({ id: sizeId })),
          },
        }),
        ...(deletedImageIds && {
          images: {
            deleteMany: {
              id: { in: deletedImageIds.map((id: string | number) => +id) },
            },
          },
        }),
        ...(images && {
          images: {
            create: images.map((img: { url: string }) => ({ url: img.url })),
          },
        }),
      },
      include: {
        images: true,
        sizes: true,
        brand: true,
        color: true,
        category: true,
        gender: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product successfully removed' };
  }
}
