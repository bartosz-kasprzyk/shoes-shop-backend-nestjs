import { IsArray, IsInt, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsNumber()
  brand: number;

  @IsNumber()
  color: number;

  @IsNumber()
  categories: number;

  @IsNumber()
  gender: number;

  @IsArray()
  @IsInt({ each: true })
  sizes: number[];

  @IsArray()
  images: { url: string; id?: number }[];

  @IsNumber()
  userID: number;
}
