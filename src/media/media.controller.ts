import {
  Controller,
  Delete,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    const uploadedMedia = await Promise.all(
      files.map((file) => this.mediaService.uploadImage(file)),
    );

    return uploadedMedia.map((media) => ({
      id: media.id,
      url: media.url,
    }));
  }

  @Delete('files/:id')
  async deleteFile(@Param('id') id: string) {
    return this.mediaService.deleteImage(+id);
  }
}
