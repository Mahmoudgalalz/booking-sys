import { 
  Injectable, 
  NotFoundException, 
  ForbiddenException, 
  ConflictException 
} from '@nestjs/common';
import { DataSource, In } from 'typeorm';
import { ServiceRepository } from '../shared/repositories/service.repository';
import { BookingRepository } from '../shared/repositories/booking.repository';
import { TimeSlotRepository } from '../shared/repositories/time-slot.repository';
import { CreateBookingValidation } from './validation/create-booking.validation';
import { Booking } from '../shared/entities/bookings.entity';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly slotRepository: TimeSlotRepository,
    private readonly serviceRepository: ServiceRepository,
    private dataSource: DataSource,
  ) {}

  async create(createBookingDto: CreateBookingValidation, userId: number): Promise<Booking> {
    // Start a transaction to ensure atomicity
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const slot = await this.slotRepository.findOne({
        where: { id: createBookingDto.slotId },
        relations: ['service'],
        lock: { mode: 'pessimistic_write' }, // Lock the row to prevent concurrent bookings
      });
      
      if (!slot) {
        throw new NotFoundException(`Slot with ID ${createBookingDto.slotId} not found`);
      }
      
      if (!slot.isAvailable) {
        throw new ConflictException('This slot is already booked');
      }
      
      // Create the booking
      const booking = this.bookingRepository.create({
        userId,
        timeSlotId: createBookingDto.slotId,
        status: 'confirmed',
      });
      
      // Save the booking
      const savedBooking = await queryRunner.manager.save(booking);
      
      slot.isAvailable = false;
      await queryRunner.manager.save(slot);
      
      await queryRunner.commitTransaction();
      
      return savedBooking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findByUserId(userId: number): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { userId },
      relations: ['slot', 'slot.service'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByProviderId(providerId: number): Promise<Booking[]> {
    // Find all services owned by this provider
    const services = await this.serviceRepository.find({
      where: { providerId },
      select: ['id'],
    });
    
    const serviceIds = services.map(service => service.id);
    
    // Find all slots for these services
    const slots = await this.slotRepository.find({
      where: { serviceId: In(serviceIds) },
      select: ['id'],
    });
    
    const slotIds = slots.map(slot => slot.id);
    
    // Find all bookings for these slots
    return this.bookingRepository.find({
      where: { timeSlotId: In(slotIds) },
      relations: ['timeSlot', 'timeSlot.service', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async cancel(id: number, userId: number, roleName: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['timeSlot', 'timeSlot.service'],
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
      
      // Update the slot to make it available again
      const slot = booking.timeSlot;
      slot.isAvailable = true;
      await queryRunner.manager.save(slot);
      
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
