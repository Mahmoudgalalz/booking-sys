import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterValidation } from './validation/register.validation';
import { LoginValidation } from './validation/login.validation';
import { ResponseUtil } from '../utils/response-util';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../decorators/user.decorator';
import { AuthUser } from '../types/auth-user.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterValidation) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginValidation) {
    try {
      const user = await this.authService.login(loginDto);
      return ResponseUtil.success(user);
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@User() user: AuthUser) {
    try {
      const userProfile = await this.authService.getProfile(user.sub);
      return ResponseUtil.success(userProfile);
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
