import { IsNotEmpty, IsNumber, IsDateString, IsBoolean, IsOptional, Min, Max } from 'class-validator';

export class CreateSlotValidation {
  @IsNotEmpty()
  @IsNumber()
  serviceId: number;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;
  
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(6)
  dayOfWeek?: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;
}
