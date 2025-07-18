import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CreateBookingValidation } from './validation/create-booking.validation';
import { JwtAuthGuard } from '../shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/auth/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { RolesEnum } from '../shared/enums/roles.enum';
import { User } from '../shared/decorators/user.decorator';
import { BookingsService } from './bookings.service';
import { AuthUser } from '../shared/types/auth-user.type';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(RolesEnum.USER)
  @UseGuards(RolesGuard)
  create(@Body() createBookingDto: CreateBookingValidation, @User() user: AuthUser) {
    return this.bookingsService.create(createBookingDto, user.sub);
  }

  @Get('me')
  @Roles(RolesEnum.USER, RolesEnum.PROVIDER)
  findMyBookings(@User() user: AuthUser) {
    return this.bookingsService.findByUserId(user.sub);
  }

  @Get('provider')
  @Roles(RolesEnum.PROVIDER)
  @UseGuards(RolesGuard)
  findProviderBookings(@User() user: AuthUser) {
    return this.bookingsService.findByProviderId(user.sub);
  }

  @Patch(':id/cancel')
  @Roles(RolesEnum.USER)
  cancelBooking(@Param('id') id: string, @User() user: AuthUser) {
    return this.bookingsService.cancel(+id, user.sub, user.role);
  }
}
