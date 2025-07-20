import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, IsBoolean, ValidateNested, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateServiceValidation {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateSlotValidation)
  slots: CreateSlotValidation[];
}

export class CreateSlotValidation {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @IsNotEmpty()
  @IsNumber()
  dayOfWeek: number;

  @IsNotEmpty()
  @IsBoolean()
  isRecurring: boolean;
}