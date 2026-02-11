import { Controller, Get } from '@nestjs/common';
import { SizesService } from './sizes.service';

@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @Get()
  async findAll() {
    const sizes = await this.sizesService.findAll();

    return { data: sizes };
  }
}
