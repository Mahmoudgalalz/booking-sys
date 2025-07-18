import { PartialType } from '@nestjs/mapped-types';
import { CreateSlotValidation } from './create-slot.validation';

export class UpdateSlotValidation extends PartialType(CreateSlotValidation) {}
