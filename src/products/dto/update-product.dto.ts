import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  deletedImageIds?: number[];

  @IsOptional()
  @IsArray()
  images?: any[];
}
