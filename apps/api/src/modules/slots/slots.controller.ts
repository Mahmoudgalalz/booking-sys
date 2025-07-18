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
import { SlotsService } from './slots.service';
import { RolesGuard } from '../shared/auth/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { AuthUser } from '../shared/types/auth-user.type';
import { CreateSlotValidation } from './validation/create-slot.validation';
import { UpdateSlotValidation } from './validation/update-slot.validation';
import { RolesEnum } from '../shared/enums/roles.enum';
import { JwtAuthGuard } from '../shared/auth/guards/jwt-auth.guard';
import { User } from '../shared/decorators/user.decorator';

@Controller('slots')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SlotsController {
  constructor(private readonly slotsService: SlotsService) {}

  @Post()
  @Roles(RolesEnum.PROVIDER)
  create(@Body() createSlotDto: CreateSlotValidation, @User() user: AuthUser) {
    return this.slotsService.create(createSlotDto, user.sub);
  }

  @Get()
  @Roles(RolesEnum.PROVIDER, RolesEnum.USER)
  findAll(@Query('serviceId') serviceId?: string) {
    return this.slotsService.findAll(serviceId ? +serviceId : undefined);
  }

  @Get(':id')
  @Roles(RolesEnum.PROVIDER, RolesEnum.USER)
  findOne(@Param('id') id: string) {
    return this.slotsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(RolesEnum.PROVIDER)
  update(
    @Param('id') id: string,
    @Body() updateSlotDto: UpdateSlotValidation,
    @User() user: AuthUser,
  ) {
    return this.slotsService.update(+id, updateSlotDto, user.sub);
  }

  @Delete(':id')
  @Roles(RolesEnum.PROVIDER)
  remove(@Param('id') id: string, @User() user: AuthUser) {
    return this.slotsService.remove(+id, user.sub);
  }
}
