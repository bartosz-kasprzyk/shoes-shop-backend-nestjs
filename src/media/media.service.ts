import { Inject, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(
    private prisma: PrismaService,
    @Inject('CLOUDINARY') private cloudinaryConfig,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'shoes-shop',
          resource_type: 'auto',
        },
        async (error: any, result: any) => {
          if (error) return reject(error);

          const media = await this.prisma.media.create({
            data: {
              url: result.secure_url,
              publicId: result.public_id,
            },
          });
          resolve(media);
        },
      );
      upload.end(file.buffer);
    });
  }

  async deleteImage(id: number) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) return { message: 'Already gone' };

    if (media.publicId) {
      await cloudinary.uploader.destroy(media.publicId);
    }

    return this.prisma.media.delete({ where: { id } });
  }
}
