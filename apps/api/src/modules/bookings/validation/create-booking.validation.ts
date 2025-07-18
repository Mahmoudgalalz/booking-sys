import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateBookingValidation {
  @IsNotEmpty()
  @IsNumber()
  slotId: number;
}
