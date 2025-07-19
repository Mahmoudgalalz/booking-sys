import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateServiceValidation {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  image?: string;
}
