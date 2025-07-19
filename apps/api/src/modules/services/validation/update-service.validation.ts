import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceValidation } from './create-service.validation';

export class UpdateServiceValidation extends PartialType(CreateServiceValidation) {}
