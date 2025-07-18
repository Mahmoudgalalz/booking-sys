import { IsNotEmpty, IsNumber, IsDateString } from 'class-validator';

export class CreateSlotValidation {
  @IsNotEmpty()
  @IsDateString()
  startTime: string;

  @IsNotEmpty()
  @IsDateString()
  endTime: string;

  @IsNotEmpty()
  @IsNumber()
  serviceId: number;
}
