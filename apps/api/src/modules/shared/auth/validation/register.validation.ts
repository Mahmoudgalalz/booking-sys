import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { isUnique } from '../../decorators/validation/rules/unique.decorator';
import { RolesEnum } from '../../enums/roles.enum';

export class RegisterValidation {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @isUnique({ tableName: 'users', column: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(RolesEnum)
  role: RolesEnum;
}
