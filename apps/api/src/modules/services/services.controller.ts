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
  HttpStatus,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/auth/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { User } from '../shared/decorators/user.decorator';
import { ResponseUtil } from '../shared/utils/response-util';
import { AuthUser } from '../shared/types/auth-user.type';
import { CreateServiceValidation } from './validation/create-service.validation';
import { UpdateServiceValidation } from './validation/update-service.validation';
import { RolesEnum } from '../shared/enums/roles.enum';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles(RolesEnum.PROVIDER)
  async create(@Body() createServiceDto: CreateServiceValidation, @User() user: AuthUser) {
    try {
      const service = await this.servicesService.create(createServiceDto, user.userId);
      return ResponseUtil.success(service, 'Service created successfully', HttpStatus.CREATED);
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @Roles(RolesEnum.PROVIDER, RolesEnum.USER)
  async findAll(@User() user: AuthUser, @Query() pagination: IPaginationOptions,
    @Query('category') category?: string, @Query('search') search?: string) {
    try {
      const services = await this.servicesService.findAll(user.userId, pagination, category, search);
      return ResponseUtil.success(services, 'Services retrieved successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const service = await this.servicesService.findOne(+id);
      return ResponseUtil.success(service, 'Service retrieved successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @Roles(RolesEnum.PROVIDER)
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceValidation,
    @User() user: AuthUser,
  ) {
    try {
      const service = await this.servicesService.update(+id, updateServiceDto, user.userId);
      return ResponseUtil.success(service, 'Service updated successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @Roles(RolesEnum.PROVIDER)
  async remove(@Param('id') id: string, @User() user: AuthUser) {
    try {
      await this.servicesService.remove(+id, user.userId);
      return ResponseUtil.success(null, 'Service deleted successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
