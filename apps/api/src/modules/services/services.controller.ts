import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/auth/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { User } from '../shared/decorators/user.decorator';
import { AuthUser } from '../shared/types/auth-user.type';
import { CreateServiceValidation } from './validation/create-service.validation';
import { UpdateServiceValidation } from './validation/update-service.validation';
import { RolesEnum } from '../shared/enums/roles.enum';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(RolesEnum.PROVIDER)
  create(@Body() createServiceDto: CreateServiceValidation, @User() user: AuthUser) {
    return this.servicesService.create(createServiceDto, user.sub);
  }

  @Get()
  @Roles(RolesEnum.PROVIDER, RolesEnum.USER)
  findAll(@Query('category') category?: string, @Query('search') search?: string) {
    return this.servicesService.findAll(category, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RolesEnum.PROVIDER)
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceValidation,
    @User() user: AuthUser,
  ) {
    return this.servicesService.update(+id, updateServiceDto, user.sub);
  }

  @Delete(':id')
  @Roles(RolesEnum.PROVIDER)
  remove(@Param('id') id: string, @User() user: AuthUser) {
    return this.servicesService.remove(+id, user.sub);
  }
}
