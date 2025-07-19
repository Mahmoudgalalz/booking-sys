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
    // Verify that the service belongs to the provider
    const service = await this.serviceRepository.findOne({
      where: { id: createSlotDto.serviceId, providerId },
    });

    if (!service) {
      throw new ForbiddenException('You can only create slots for your own services');
    }

    const slot = this.timeSlotRepository.create({
      ...createSlotDto,
      isAvailable: true,
    });

    return this.timeSlotRepository.save(slot);
  }

  async findAll(options: IPaginationOptions, serviceId?: number): Promise<Pagination<TimeSlot>> {
    const queryBuilder = this.timeSlotRepository.createQueryBuilder('timeSlot')
      .leftJoinAndSelect('timeSlot.service', 'service')
      .where('timeSlot.isAvailable = :isAvailable', { isAvailable: true });
    
    if (serviceId) {
      queryBuilder.andWhere('timeSlot.serviceId = :serviceId', { serviceId });
    }
    
    queryBuilder.orderBy('timeSlot.startTime', 'ASC');
    
    return paginate<TimeSlot>(queryBuilder, options);
  }

  async findOne(id: number): Promise<TimeSlot> {
    const slot = await this.timeSlotRepository.findOne({
      where: { id },
      relations: ['service', 'booking'],
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
    if (slot.bookings) {
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
    if (slot.bookings) {
      throw new ForbiddenException('Cannot delete a slot that is already booked');
    }
    
    await this.timeSlotRepository.delete(id);
  }
}
