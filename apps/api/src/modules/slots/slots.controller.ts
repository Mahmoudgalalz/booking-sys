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
import { SlotsService } from './slots.service';
import { RolesGuard } from '../shared/auth/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { AuthUser } from '../shared/types/auth-user.type';
import { CreateSlotValidation } from './validation/create-slot.validation';
import { UpdateSlotValidation } from './validation/update-slot.validation';
import { RolesEnum } from '../shared/enums/roles.enum';
import { JwtAuthGuard } from '../shared/auth/guards/jwt-auth.guard';
import { User } from '../shared/decorators/user.decorator';
import { ResponseUtil } from '../shared/utils/response-util';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller('slots')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  @Roles(RolesEnum.PROVIDER)
  async create(@Body() createSlotDto: CreateSlotValidation, @User() user: AuthUser) {
    try {
      const slot = await this.slotsService.create(createSlotDto, user.sub);
      return ResponseUtil.success(slot, 'Time slot created successfully', HttpStatus.CREATED);
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @Roles(RolesEnum.PROVIDER, RolesEnum.USER)
  async findAll(
    @Query() options: IPaginationOptions,
    @Query('serviceId') serviceId?: string
  ) {
    try {
      const slots = await this.slotsService.findAll(options, serviceId ? +serviceId : undefined);
      return ResponseUtil.success(slots, 'Time slots retrieved successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @Roles(RolesEnum.PROVIDER, RolesEnum.USER)
  async findOne(@Param('id') id: string) {
    try {
      const slot = await this.slotsService.findOne(+id);
      return ResponseUtil.success(slot, 'Time slot retrieved successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  @Roles(RolesEnum.PROVIDER)
  async update(
    @Param('id') id: string,
    @Body() updateSlotDto: UpdateSlotValidation,
    @User() user: AuthUser,
  ) {
    try {
      const slot = await this.slotsService.update(+id, updateSlotDto, user.sub);
      return ResponseUtil.success(slot, 'Time slot updated successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @Roles(RolesEnum.PROVIDER)
  async remove(@Param('id') id: string, @User() user: AuthUser) {
    try {
      await this.slotsService.remove(+id, user.sub);
      return ResponseUtil.success(null, 'Time slot deleted successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
