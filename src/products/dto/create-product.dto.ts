import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsString()
  color: string;

  @IsString()
  gender: string;

  @IsString()
  brand: string;

  @IsString()
  categories: string;

  @IsArray()
//   @IsString({ each: true })
  sizes: string[];

  @IsNumber()
  userID: number;
}
