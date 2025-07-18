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
  Request,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/auth/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Provider')
  create(@Body() createServiceDto: CreateServiceDto, @Request() req) {
    return this.servicesService.create(createServiceDto, req.user.id);
  }

  @Get()
  findAll(@Query('category') category?: string, @Query('search') search?: string) {
    return this.servicesService.findAll(category, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Provider')
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Request() req,
  ) {
    return this.servicesService.update(+id, updateServiceDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Provider')
  remove(@Param('id') id: string, @Request() req) {
    return this.servicesService.remove(+id, req.user.id);
  }
}
