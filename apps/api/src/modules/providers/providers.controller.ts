import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
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

@Controller('providers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post('profile')
  @Roles(RolesEnum.PROVIDER)
  createProfile(@Body() createProfileDto: CreateProviderProfileDto, @User() user: AuthUser) {
    return this.providersService.createProfile(createProfileDto, user.sub);
  }

  @Patch('profile')
  @Roles(RolesEnum.PROVIDER)
  updateProfile(@Body() updateProfileDto: UpdateProviderProfileDto, @User() user: AuthUser) {
    return this.providersService.updateProfile(updateProfileDto, user.sub);
  }

  @Get('profile')
  @Roles(RolesEnum.PROVIDER)
  getProfile(@User() user: AuthUser) {
    return this.providersService.getProfile(user.sub);
  }

  @Get()
  findAll() {
    return this.providersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providersService.findOne(+id);
  }
}
