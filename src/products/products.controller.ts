import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() dto: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsService.create(dto, files);
  }

  @Get()
  async findAll() {
    const products = await this.productsService.findAll();
    return { data: products };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productsService.findOne(id);
    return { data: product };
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles() files: Express.Multer.File[] = [],
    @Body() dto: any,
  ) {
    const updateProductDto = dto.data ? dto.data : dto;

    return this.productsService.update(id, updateProductDto, files);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
