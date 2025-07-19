import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CreateBookingValidation } from './validation/create-booking.validation';
import { JwtAuthGuard } from '../shared/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../shared/auth/guards/roles.guard';
import { Roles } from '../shared/decorators/roles.decorator';
import { RolesEnum } from '../shared/enums/roles.enum';
import { User } from '../shared/decorators/user.decorator';
import { BookingsService } from './bookings.service';
import { AuthUser } from '../shared/types/auth-user.type';
import { ResponseUtil } from '../shared/utils/response-util';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(RolesEnum.USER)
  @UseGuards(RolesGuard)
  async create(@Body() createBookingDto: CreateBookingValidation, @User() user: AuthUser) {
    try {
      const booking = await this.bookingsService.create(createBookingDto, user.sub);
      return ResponseUtil.success(booking, 'Booking created successfully', HttpStatus.CREATED);
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('me')
  @Roles(RolesEnum.USER, RolesEnum.PROVIDER)
  async findMyBookings(@User() user: AuthUser, @Query() pagination: IPaginationOptions) {
    try {
      const bookings = await this.bookingsService.findByUserId(user.sub, pagination);
      return ResponseUtil.success(bookings, 'User bookings retrieved successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('provider')
  @Roles(RolesEnum.PROVIDER)
  @UseGuards(RolesGuard)
  async findProviderBookings(@User() user: AuthUser, @Query() pagination: IPaginationOptions) {
    try {
      const bookings = await this.bookingsService.findByProviderId(user.sub, pagination);
      return ResponseUtil.success(bookings, 'Provider bookings retrieved successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id/cancel')
  @Roles(RolesEnum.USER)
  async cancelBooking(@Param('id') id: string, @User() user: AuthUser) {
    try {
      const booking = await this.bookingsService.cancel(+id, user.sub, user.role);
      return ResponseUtil.success(booking, 'Booking cancelled successfully');
    } catch (err) {
      return ResponseUtil.error(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
