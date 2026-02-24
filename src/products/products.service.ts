import { Injectable, NotFoundException } from '@nestjs/common';
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
        brand: {
          data: p.brand
            ? {
                id: p.brand.id,
                attributes: {
                  name: p.brand.name,
                },
              }
            : null,
        },
        color: {
          data: p.color
            ? {
                id: p.color.id,
                attributes: {
                  name: p.color.name,
                },
              }
            : null,
        },
        gender: {
          data: p.gender
            ? {
                id: p.gender.id,
                attributes: {
                  name: p.gender.name,
                },
              }
            : null,
        },
        categories: {
          data: p.category
            ? [
                {
                  id: p.category.id,
                  attributes: {
                    name: p.category.name,
                  },
                },
              ]
            : [],
        },
        sizes: {
          data:
            p.sizes?.map((s: any) => ({
              id: s.id,
              attributes: {
                value: Number(s.name),
              },
            })) || [],
        },
        images: {
          data:
            p.images?.map((img: any) => ({
              id: img.id,
              attributes: {
                url: img.media?.url || '',
              },
            })) || [],
        },
        userID: String(p.userId),
        teamName: 'team-5',
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      },
    };
  }

  async create(input: any, files: Express.Multer.File[] = []) {
    const dto = input.data;

    const { deletedImageIds, ...cleanedDto } = dto;
    const {
      sizes,
      userID,
      brand,
      categories,
      color,
      gender,
      images,
      teamName,
      ...rest
    } = cleanedDto;

    const safeFiles = files || [];
    const uploadedMedia = await Promise.all(
      safeFiles.map((file) => this.mediaService.uploadImage(file)),
    );
    const newMediaIds = uploadedMedia.map((m) => m.id);

    const existingImageIds = Array.isArray(images)
      ? images
      : images
        ? [images]
        : [];

    const allMediaIds = [
      ...newMediaIds,
      ...existingImageIds.map((id: any) => +id),
    ];

    const sizesArray = Array.isArray(sizes) ? sizes : sizes ? [sizes] : [];

    const product = await this.prisma.product.create({
      data: {
        ...rest,
        ...(userID && { user: { connect: { id: +userID } } }),
        ...(brand && { brand: { connect: { id: +brand } } }),
        ...(categories && { category: { connect: { id: +categories } } }),
        ...(color && { color: { connect: { id: +color } } }),
        ...(gender && { gender: { connect: { id: +gender } } }),
        sizes: {
          connect: sizesArray.map((id) => ({ id: +id })),
        },
        images: {
          create: allMediaIds.map((id) => ({ mediaId: id })),
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

    return { data: this.mapToStrapi(product) };
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

  async findOne(id: number) {
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

  async update(id: number, dto: any, files: Express.Multer.File[] = []) {
    const {
      deletedImageIds,
      sizes,
      userID,
      brand,
      categories,
      color,
      gender,
      images,
      teamName,
      ...rest
    } = dto;

    // Parse IDs from frontend
    const incomingIds = (
      Array.isArray(images) ? images : images ? [images] : []
    ).map(Number);
    const toDeleteManual = (
      Array.isArray(deletedImageIds)
        ? deletedImageIds
        : deletedImageIds
          ? [deletedImageIds]
          : []
    ).map(Number);
    const sizesArray = (
      Array.isArray(sizes) ? sizes : sizes ? [sizes] : []
    ).map(Number);

    // Upload brand new files
    const uploadedMedia = await Promise.all(
      files.map((f) => this.mediaService.uploadImage(f)),
    );
    const newMediaIds = uploadedMedia.map((m) => m.id);

    // Get current database state
    const currentLinks = await this.prisma.productImage.findMany({
      where: { productId: id },
      select: { mediaId: true },
    });
    const currentMediaIds = currentLinks.map((l) => l.mediaId);

    // Delete: Anything in DB that is not in incomingIds or is in toDeleteManual
    const idsToRemove = currentMediaIds.filter(
      (id) => !incomingIds.includes(id) || toDeleteManual.includes(id),
    );

    // Add the new uploads + anything incoming that isn't already linked
    const idsToAdd = [
      ...newMediaIds,
      ...incomingIds.filter((id) => !currentMediaIds.includes(id)),
    ];

    return await this.prisma.$transaction(async (tx) => {
      if (idsToRemove.length > 0) {
        await tx.productImage.deleteMany({
          where: { productId: id, mediaId: { in: idsToRemove } },
        });
      }

      if (idsToAdd.length > 0) {
        await tx.productImage.createMany({
          data: idsToAdd.map((mId) => ({ productId: id, mediaId: mId })),
          skipDuplicates: true,
        });
      }

      const product = await tx.product.update({
        where: { id },
        data: {
          ...rest,
          price: rest.price ? +rest.price : undefined,
          brand: brand ? { connect: { id: +brand } } : undefined,
          category: categories ? { connect: { id: +categories } } : undefined,
          color: color ? { connect: { id: +color } } : undefined,
          gender: gender ? { connect: { id: +gender } } : undefined,
          user: userID ? { connect: { id: +userID } } : undefined,
          sizes: { set: sizesArray.map((sId) => ({ id: sId })) },
        },
        include: {
          images: { include: { media: true }, orderBy: { id: 'asc' } },
          brand: true,
          category: true,
          color: true,
          gender: true,
          sizes: true,
        },
      });

      // Cleanup physical media
      if (toDeleteManual.length > 0) {
        await tx.media
          .deleteMany({ where: { id: { in: toDeleteManual } } })
          .catch(() => null);
      }

      return { data: this.mapToStrapi(product) };
    });
  }

  async remove(id: number) {
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
