import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('files'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    const media = await this.mediaService.uploadImage(file);

    return [
      {
        id: media.id,
        url: media.url,
      },
    ];
  }
}
