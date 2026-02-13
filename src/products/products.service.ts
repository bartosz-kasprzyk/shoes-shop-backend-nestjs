import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/media/media.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private mediaService: MediaService,
  ) {}

  private mapToStrapi(p: any) {
    return {
      id: p.id,
      attributes: {
        name: p.name,
        price: Number(p.price),
        description: p.description,
        brand: { data: p.brand ? { id: p.brand.id } : null },
        color: { data: p.color ? { id: p.color.id } : null },
        gender: { data: p.gender ? { id: p.gender.id } : null },
        categories: { data: p.category ? [{ id: p.category.id }] : [] },
        sizes: { data: p.sizes?.map((s) => ({ id: s.id })) || [] },
        images: {
          data:
            p.images?.map((img) => ({
              id: img.id,
              attributes: { url: img.media.url },
            })) || [],
        },
      },
    };
  }

  async create(dto: CreateProductDto, files: Express.Multer.File[]) {
    const { sizes, userID, brand, categories, color, gender, ...rest } = dto;

    const uploadedMedia = await Promise.all(
      files.map((file) => this.mediaService.uploadImage(file)),
    );

    const product = await this.prisma.product.create({
      data: {
        ...rest,
        user: { connect: { id: +userID } },
        brand: { connect: { id: +brand } },
        category: { connect: { id: +categories } },
        color: { connect: { id: +color } },
        gender: { connect: { id: +gender } },
        sizes: { connect: sizes.map((id) => ({ id: +id })) },
        images: {
          create: uploadedMedia.map((media) => ({ mediaId: media.id })),
        },
      },
      include: {
        images: { include: { media: true } },
        brand: true,
        category: true,
        color: true,
        gender: true,
        sizes: true,
      },
    });

    return this.mapToStrapi(product);
  }

  async findAll() {
    const products = await this.prisma.product.findMany({
      include: {
        images: { include: { media: true } },
        brand: true,
        category: true,
        color: true,
        gender: true,
        sizes: true,
      },
    });

    return products.map((p) => this.mapToStrapi(p));
  }

  async findOne(id: string) {
    const p = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: { include: { media: true } },
        brand: true,
        category: true,
        color: true,
        gender: true,
        sizes: true,
      },
    });

    if (!p) throw new NotFoundException(`Product not found`);

    return this.mapToStrapi(p);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    files: Express.Multer.File[],
  ) {
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

    const newUploadedMedia = await Promise.all(
      files.map((file) => this.mediaService.uploadImage(file)),
    );

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(brand && { brand: { connect: { id: +brand } } }),
        ...(categories && { category: { connect: { id: +categories } } }),
        ...(color && { color: { connect: { id: +color } } }),
        ...(gender && { gender: { connect: { id: +gender } } }),
        ...(sizes && { sizes: { set: sizes.map((sid) => ({ id: +sid })) } }),
        images: {
          ...(deletedImageIds && {
            deleteMany: { id: { in: deletedImageIds.map((did) => +did) } },
          }),
          create: newUploadedMedia.map((media) => ({
            media: { connect: { id: media.id } },
          })),
        },
      },
      include: {
        images: { include: { media: true } },
        brand: true,
        category: true,
        color: true,
        gender: true,
        sizes: true,
      },
    });

    return this.mapToStrapi(product);
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
