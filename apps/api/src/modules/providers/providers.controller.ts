import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/auth/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { RolesEnum } from '../shared/enums/roles.enum';
import { User } from '../shared/decorators/user.decorator';
import { ProvidersService } from './providers.service';
import { CreateProviderProfileDto } from './validation/create-provider-profile.validation';
import { UpdateProviderProfileDto } from './validation/update-provider-profile.validation';
import { AuthUser } from '../shared/types/auth-user.type';
import { ResponseUtil } from '../shared/utils/response-util';

@Controller('providers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post('profile')
  @Roles(RolesEnum.PROVIDER)
  async createProfile(@Body() createProfileDto: CreateProviderProfileDto, @User() user: AuthUser) {
    try {
      const profile = await this.providersService.createProfile(createProfileDto, user.userId);
      return ResponseUtil.success(profile, 'Provider profile created successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch('profile')
  @Roles(RolesEnum.PROVIDER)
  async updateProfile(@Body() updateProfileDto: UpdateProviderProfileDto, @User() user: AuthUser) {
    try {
      const profile = await this.providersService.updateProfile(updateProfileDto, user.userId);
      return ResponseUtil.success(profile, 'Provider profile updated successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('profile')
  @Roles(RolesEnum.PROVIDER)
  async getProfile(@User() user: AuthUser) {
    try {
      const profile = await this.providersService.getProfile(user.userId);
      return ResponseUtil.success(profile, 'Provider profile retrieved successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      const providers = await this.providersService.findAll();
      return ResponseUtil.success(providers, 'Providers retrieved successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const provider = await this.providersService.findOne(+id);
      return ResponseUtil.success(provider, 'Provider retrieved successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
