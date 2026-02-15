import { Controller, Get } from '@nestjs/common';
import { ColorsService } from './colors.service';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Get()
  async findAll() {
    const colors = await this.colorsService.findAll();

    return { data: colors };
  }
}
