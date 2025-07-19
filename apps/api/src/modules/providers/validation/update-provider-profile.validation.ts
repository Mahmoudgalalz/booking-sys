import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProviderProfileDto {
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  specialization?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  experience?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;
}
