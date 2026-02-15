import { Controller, Get } from '@nestjs/common';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get()
  async findAll() {
    const brands = await this.brandsService.findAll();

    return { data: brands };
  }
}
