import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ServiceRepository } from '../shared/repositories/service.repository';
import { TimeSlotRepository } from '../shared/repositories/time-slot.repository';
import { CreateSlotValidation } from './validation/create-slot.validation';
import { TimeSlot } from '../shared/entities/time-slots.entity';
import { UpdateSlotValidation } from './validation/update-slot.validation';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';

@Injectable()
export class SlotsService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly timeSlotRepository: TimeSlotRepository,
  ) {}

  async create(createSlotDto: CreateSlotValidation, providerId: number): Promise<TimeSlot> {
    const service = await this.serviceRepository.findOne({
      where: { id: createSlotDto.serviceId, providerId },
    });
    if (!service) {
      throw new ForbiddenException('You can only create slots for your own services');
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
  
  async findAvailableSlotsByDay(serviceId: number, date: Date, options: IPaginationOptions): Promise<Pagination<TimeSlot>> {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // Get both specific date slots and recurring slots for this day of week
    const queryBuilder = this.timeSlotRepository.createQueryBuilder('timeSlot')
      .leftJoinAndSelect('timeSlot.service', 'service')
      .where('timeSlot.serviceId = :serviceId', { serviceId })
      .andWhere('timeSlot.available = :available', { available: true })
      .andWhere(
        '(DATE(timeSlot.date) = DATE(:date) OR ' +
        '(timeSlot.isRecurring = TRUE AND timeSlot.dayOfWeek = :dayOfWeek))'
      )
      .setParameters({ date: date.toISOString(), dayOfWeek })
      .orderBy('timeSlot.startTime', 'ASC');
    
    return paginate<TimeSlot>(queryBuilder, options);
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
