import {
  IsString,
  IsNotEmpty,
  MinLength,
  IsEmail,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginValidation {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
