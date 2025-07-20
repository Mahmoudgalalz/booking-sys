import { IsNotEmpty, IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateBookingValidation {
  @IsNotEmpty()
  @IsNumber()
  timeSlotId: number;

  @IsNotEmpty()
  @IsDateString()
  bookedAt: string; // ISO string for the specific booking time

  @IsOptional()
  @IsString()
  notes?: string;
}
