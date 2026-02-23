import {
  IsOptional,
  IsString,
  Matches,
  IsNotEmpty,
  ValidateIf,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((_, value) => value !== '' && value !== null)
  @Matches(/^\+?\d{7,15}$/, { message: 'Invalid phone number' })
  phoneNumber?: string | null;

  @IsOptional()
  avatar?: {
    id: number;
    url?: string;
  };
}
