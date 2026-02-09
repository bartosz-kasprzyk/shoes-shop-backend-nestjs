import { IsArray, IsInt, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;
  @IsNumber()
  price: number;
  @IsString()
  description: string;

  @IsNumber()
  brandId: number;
  @IsNumber()
  colorId: number;
  @IsNumber()
  categoryId: number;
  @IsNumber()
  genderId: number;

  @IsArray()
  @IsInt({ each: true })
  sizes: number[];

  @IsArray()
  @IsUrl({}, { each: true })
  images: string[];

  @IsNumber()
  userID: number;
}
