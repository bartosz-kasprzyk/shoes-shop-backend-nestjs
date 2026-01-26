import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SigninDto {
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
