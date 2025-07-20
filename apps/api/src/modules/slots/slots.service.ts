import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot } from '../shared/entities/time-slots.entity';
import { Service } from '../shared/entities/services.entity';
import { CreateSlotValidation } from './validation/create-slot.validation';
import { UpdateSlotValidation } from './validation/update-slot.validation';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

interface BookableInterval {
  id: string;
  slotId: number;
  startTime: string;
  endTime: string;
  booked: boolean;
  serviceId: number;
  service?: {
    id: number;
    title: string;
    duration: number;
  };
}

@Injectable()
export class SlotsService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(TimeSlot)
    private readonly timeSlotRepository: Repository<TimeSlot>,
  ) {}

  async create(createSlotDto: CreateSlotValidation, providerId: number): Promise<TimeSlot> {
    const service = await this.serviceRepository.findOne({
      where: { id: createSlotDto.serviceId, providerId },
    });
    if (!service) {
      throw new ForbiddenException('You can only create slots for your own services');
    }

    // Check if a slot with the same time already exists for this service
    const existingSlot = await this.timeSlotRepository.findOne({
      where: {
        serviceId: createSlotDto.serviceId,
        date: new Date(createSlotDto.date),
        startTime: new Date(createSlotDto.startTime),
        endTime: new Date(createSlotDto.endTime),
        available: true, // Only check available slots
      },
    });

    if (existingSlot) {
      throw new ForbiddenException('A time slot with the same date and time already exists for this service');
    }
  
    const slot = this.timeSlotRepository.create({
      date: new Date(createSlotDto.date),
      startTime: new Date(createSlotDto.startTime),
      endTime: new Date(createSlotDto.endTime),
      serviceId: createSlotDto.serviceId,
      available: true,
      dayOfWeek: createSlotDto.dayOfWeek,
      isRecurring: createSlotDto.isRecurring || false,
    });

    return this.timeSlotRepository.save(slot);
  }

  async findAll(options: IPaginationOptions, serviceId?: number, dayOfWeek?: number): Promise<Pagination<TimeSlot>> {
    const queryBuilder = this.timeSlotRepository.createQueryBuilder('timeSlot')
      .leftJoinAndSelect('timeSlot.service', 'service')
      .where('timeSlot.available = :available', { available: true });
    
    if (serviceId) {
      queryBuilder.andWhere('timeSlot.serviceId = :serviceId', { serviceId });
    }
    
    // Filter by day of week if provided
    if (dayOfWeek !== undefined) {
      queryBuilder.andWhere('timeSlot.dayOfWeek = :dayOfWeek', { dayOfWeek });
    }
    
    queryBuilder.orderBy('timeSlot.startTime', 'ASC');
    
    return paginate<TimeSlot>(queryBuilder, options);
  }
  
  async findAvailableSlotsByDay(serviceId: number, date: Date): Promise<BookableInterval[]> {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // Get the service to access duration
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId },
    });
    
    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }
    
    // Get recurring slots for this day of week with bookings loaded
    const slots = await this.timeSlotRepository.find({
      where: {
        serviceId,
        available: true,
        isRecurring: true,
        dayOfWeek,
      },
      relations: ['bookings'],
      order: { startTime: 'ASC' },
    });

    
    // Generate bookable intervals for each slot
    const allIntervals: BookableInterval[] = [];
    
    for (const slot of slots) {
      const intervals = this.generateBookableIntervals(slot, service, date);
      allIntervals.push(...intervals);
    }
    
    // Sort intervals by start time
    allIntervals.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    return allIntervals;
  }
  
  private generateBookableIntervals(slot: TimeSlot, service: Service, targetDate: Date): BookableInterval[] {
    const intervals: BookableInterval[] = [];
    const slotStart = new Date(slot.startTime);
    const slotEnd = new Date(slot.endTime);
    const durationMinutes = Number(service.duration);
    
    // Create intervals based on service duration
    let currentTime = new Date(slotStart);
    
    while (currentTime < slotEnd) {
      const intervalEnd = new Date(currentTime.getTime() + durationMinutes * 60000);
      
      // Don't create interval if it would exceed slot end time
      if (intervalEnd > slotEnd) {
        break;
      }
      
      // Create the actual datetime for this interval on the target date
      const intervalStartDateTime = new Date(targetDate);
      intervalStartDateTime.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
      
      const intervalEndDateTime = new Date(targetDate);
      intervalEndDateTime.setHours(intervalEnd.getHours(), intervalEnd.getMinutes(), 0, 0);
      
      // Check if this specific interval time is booked
      const isBooked = slot.bookings?.some(booking => {
        const bookingDate = new Date(booking.bookedAt);
        return (
          bookingDate.toDateString() === targetDate.toDateString() &&
          bookingDate.getHours() === currentTime.getHours() &&
          bookingDate.getMinutes() === currentTime.getMinutes()
        );
      }) || false;
      
      intervals.push({
        id: `${slot.id}-${currentTime.getHours()}-${currentTime.getMinutes()}`,
        slotId: slot.id,
        startTime: intervalStartDateTime.toISOString(),
        endTime: intervalEndDateTime.toISOString(),
        booked: isBooked,
        serviceId: slot.serviceId,
        service: {
          id: service.id,
          title: service.title,
          duration: service.duration,
        },
      });
      
      // Move to next interval
      currentTime = new Date(currentTime.getTime() + durationMinutes * 60000);
    }
    
    return intervals;
  }

  async findOne(id: number): Promise<TimeSlot> {
    const slot = await this.timeSlotRepository.findOne({
      where: { id },
      relations: ['service', 'bookings'],
    });
    
    if (!slot) {
      throw new NotFoundException(`Slot with ID ${id} not found`);
    }
    
    return slot;
  }

  async update(id: number, updateSlotDto: UpdateSlotValidation, providerId: number): Promise<TimeSlot> {
    const slot = await this.findOne(id);
    
    // Verify that the slot's service belongs to the provider
    const service = await this.serviceRepository.findOne({
      where: { id: slot.serviceId, providerId },
    });

    if (!service) {
      throw new ForbiddenException('You can only update slots for your own services');
    }
    
    // Don't allow updating if the slot is already booked
    if (slot.bookings && slot.bookings.length > 0) {
      throw new ForbiddenException('Cannot update a slot that is already booked');
    }
    
    await this.timeSlotRepository.update(id, updateSlotDto);
    return this.findOne(id);
  }

  async remove(id: number, providerId: number): Promise<void> {
    const slot = await this.findOne(id);
    
    // Verify that the slot's service belongs to the provider
    const service = await this.serviceRepository.findOne({
      where: { id: slot.serviceId, providerId },
    });

    if (!service) {
      throw new ForbiddenException('You can only delete slots for your own services');
    }
    
    // Don't allow deleting if the slot is already booked
    if (slot.bookings && slot.bookings.length > 0) {
      throw new ForbiddenException('Cannot delete a slot that is already booked');
    }
    
    await this.timeSlotRepository.delete(id);
  }
}
