import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException, 
  ConflictException 
} from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { ServiceRepository } from '../shared/repositories/service.repository';
import { BookingRepository } from '../shared/repositories/booking.repository';
import { TimeSlotRepository } from '../shared/repositories/time-slot.repository';
import { CreateBookingValidation } from './validation/create-booking.validation';
import { Booking } from '../shared/entities/bookings.entity';
import { TimeSlot } from '../shared/entities/time-slots.entity';
import { ProviderRepository } from '../shared/repositories/provider.repository';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly slotRepository: TimeSlotRepository,
    private readonly serviceRepository: ServiceRepository,
    private readonly providerRepository: ProviderRepository,
    private dataSource: DataSource,
  ) {}

  async create(createBookingDto: CreateBookingValidation, userId: number): Promise<Booking> {
    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // First, lock the slot row to prevent concurrent bookings (without relations)
      const lockedSlot = await queryRunner.manager.findOne(TimeSlot, {
        where: { id: createBookingDto.timeSlotId },
        lock: { mode: 'pessimistic_write' },
      });
      
      if (!lockedSlot) {
        throw new NotFoundException(`Slot with ID ${createBookingDto.timeSlotId} not found`);
      }
      
      // Then load the slot with relations (now that it's locked)
      const slot = await queryRunner.manager.findOne(TimeSlot, {
        where: { id: createBookingDto.timeSlotId },
        relations: ['service', 'bookings'],
      });
      
      if (!slot) {
        throw new NotFoundException(`Slot with ID ${createBookingDto.timeSlotId} not found`);
      }
      
      // Check if the slot is available
      if (!slot.available) {
        throw new ConflictException('This time slot is not available for booking');
      }
      
      // Parse the requested booking time
      const requestedBookingTime = new Date(createBookingDto.bookedAt);
      
      // Check if the specific time interval is already booked
      const existingBooking = slot.bookings?.find(booking => {
        const bookingDate = new Date(booking.bookedAt);
        return bookingDate.getTime() === requestedBookingTime.getTime();
      });
      
      if (existingBooking && existingBooking.status !== 'cancelled') {
        throw new ConflictException('This specific time interval is already booked');
      }
      
      // Validate that the booking time falls within the slot's time range
      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slot.endTime);
      const bookingHour = requestedBookingTime.getHours();
      const bookingMinute = requestedBookingTime.getMinutes();
      
      if (bookingHour < slotStart.getHours() || 
          bookingHour > slotEnd.getHours() ||
          (bookingHour === slotEnd.getHours() && bookingMinute >= slotEnd.getMinutes())) {
        throw new ConflictException('Booking time is outside the available slot time range');
      }
      
      // Create the booking
      const booking = this.bookingRepository.create({
        userId,
        serviceId: slot.service.id, // Get serviceId from the time slot's service relation
        timeSlotId: createBookingDto.timeSlotId,
        status: 'confirmed',
        bookedAt: requestedBookingTime,
        notes: createBookingDto.notes,
      });
      
      // Save the booking
      const savedBooking = await queryRunner.manager.save(booking);
      
      // Check if all intervals in this slot are now booked
      // If so, mark the slot as unavailable
      const service = slot.service;
      const durationMinutes = Number(service.duration);
      const totalSlotMinutes = (slotEnd.getTime() - slotStart.getTime()) / (1000 * 60);
      const maxBookings = Math.floor(totalSlotMinutes / durationMinutes);
      
      const activeBookings = slot.bookings?.filter(b => b.status !== 'cancelled').length || 0;
      
      if (activeBookings + 1 >= maxBookings) {
        slot.available = false;
        await queryRunner.manager.save(slot);
      }
      
      // Commit the transaction
      await queryRunner.commitTransaction();
      
      return savedBooking;
    } catch (error) {
      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async findByUserId(userId: number, options: IPaginationOptions): Promise<Pagination<Booking>> {
    const queryBuilder = this.bookingRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.timeSlot', 'timeSlot')
      .leftJoinAndSelect('timeSlot.service', 'service')
      .where('booking.userId = :userId', { userId })
      .orderBy('booking.createdAt', 'DESC');
    
    return paginate<Booking>(queryBuilder, options);
  }

  async findByProviderId(userId: number, options: IPaginationOptions): Promise<Pagination<Booking>> {
    // Find all services owned by this provider
    const provider = await this.providerRepository.findOne({
      where: { userId },
    });
    
    if (!provider) {
      throw new NotFoundException(`Provider with userId ${userId} not found`);
    }
    
    const services = await this.serviceRepository.find({
      where: { providerId: provider.id },
      select: ['id'],
    });
    
    const serviceIds = services.map(service => service.id);
    
    // If provider has no services, return empty result
    if (serviceIds.length === 0) {
      return {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: Number(options.limit) || 10,
          totalPages: 0,
          currentPage: Number(options.page) || 1,
        },
      };
    }
    
    // Find all slots for these services
    const slots = await this.slotRepository.find({
      where: { serviceId: In(serviceIds) },
      select: ['id'],
    });
    
    const slotIds = slots.map(slot => slot.id);
    
    // If no slots exist, return empty result
    if (slotIds.length === 0) {
      return {
        items: [],
        meta: {
          totalItems: 0,
          itemCount: 0,
          itemsPerPage: Number(options.limit) || 10,
          totalPages: 0,
          currentPage: Number(options.page) || 1,
        },
      };
    }
    
    // Find all bookings for these slots using query builder for pagination
    const queryBuilder = this.bookingRepository.createQueryBuilder('booking')
      .leftJoinAndSelect('booking.timeSlot', 'timeSlot')
      .leftJoinAndSelect('timeSlot.service', 'service')
      .leftJoinAndSelect('booking.user', 'user')
      .where('booking.timeSlotId IN (:...slotIds)', { slotIds })
      .andWhere('service.providerId = :providerId', { providerId: provider.id })
      .orderBy('booking.createdAt', 'DESC');
    
    return paginate<Booking>(queryBuilder, options);
  }

  async cancel(id: number, userId: number, roleName: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['timeSlot', 'timeSlot.service', 'timeSlot.bookings'],
    });
    
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    
    // Check if the user is authorized to cancel this booking
    if (roleName === 'User' && booking.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own bookings');
    }
    
    if (roleName === 'Provider') {
      // Check if the booking is for a service owned by this provider
      const service = await this.serviceRepository.findOne({
        where: { 
          id: booking.timeSlot.serviceId,
          providerId: userId,
        },
      });
      
      if (!service) {
        throw new ForbiddenException('You can only cancel bookings for your own services');
      }
    }
    
    // Check if the booking is already cancelled
    if (booking.status === 'cancelled') {
      throw new ConflictException('This booking is already cancelled');
    }
    
    // Start a transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Update the booking status
      booking.status = 'cancelled';
      await queryRunner.manager.save(booking);
      
      // Check if the slot should be made available again
      const slot = booking.timeSlot;
      const service = slot.service;
      const durationMinutes = Number(service.duration);
      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slot.endTime);
      const totalSlotMinutes = (slotEnd.getTime() - slotStart.getTime()) / (1000 * 60);
      const maxBookings = Math.floor(totalSlotMinutes / durationMinutes);
      
      // Count active bookings (excluding the one being cancelled)
      const activeBookings = slot.bookings?.filter(b => 
        b.status !== 'cancelled' && b.id !== booking.id
      ).length || 0;
      
      // If there are now available intervals, mark the slot as available
      if (activeBookings < maxBookings) {
        slot.available = true;
        await queryRunner.manager.save(slot);
      }
      
      // Commit the transaction
      await queryRunner.commitTransaction();
      
      return booking;
    } catch (error) {
      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }
}
