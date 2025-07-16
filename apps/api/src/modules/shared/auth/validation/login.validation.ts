import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { isExists } from '../../decorators/validation/rules/exists.decorator';

export class LoginValidation {

  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @isExists({ tableName: 'users', column: 'email' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
