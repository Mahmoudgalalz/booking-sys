import { IsOptional, IsString, MaxLength, IsNumber, Min, Max } from 'class-validator';

export class UpdateProviderProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  specialization?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  experience?: number;

  @IsString()
  @IsOptional()
  profileImage?: string;
}
