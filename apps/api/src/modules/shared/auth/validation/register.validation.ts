import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { isExists } from '../../decorators/validation/rules/exists.decorator';
import { isUnique } from '../../decorators/validation/rules/unique.decorator';

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

  @IsNumber()
  @isExists({ tableName: 'roles', column: 'id' })
  roleId: number;
}
