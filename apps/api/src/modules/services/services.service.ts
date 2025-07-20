import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Like } from 'typeorm';
import { ServiceRepository } from '../shared/repositories/service.repository';
import { ProviderRepository } from '../shared/repositories/provider.repository';
import { TimeSlotRepository } from '../shared/repositories/time-slot.repository';
import { CreateServiceValidation } from './validation/create-service.validation';
import { UpdateServiceValidation } from './validation/update-service.validation';
import { Service } from '../shared/entities/services.entity';
import { TimeSlot } from '../shared/entities/time-slots.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { AuthUser } from '../shared/types/auth-user.type';

@Injectable()
export class ServicesService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly timeSlotRepository: TimeSlotRepository,
  ) {}

  async create(createServiceDto: CreateServiceValidation, userId: number): Promise<Service> {
    let provider = await this.providerRepository.findOne({
      where: { userId }
    });
    
    // Create service without time slots first
    const service = this.serviceRepository.create({
      title: createServiceDto.title,
      description: createServiceDto.description,
      duration: createServiceDto.duration,
      category: createServiceDto.category,
      image: createServiceDto.image,
      providerId: provider?.id,
    });
    
    // Save the service to get the ID
    const savedService = await this.serviceRepository.save(service);
    
    // Create and save time slots
    const timeSlots: TimeSlot[] = [];
    for (const slot of createServiceDto.slots) {
      const timeSlot = this.timeSlotRepository.create({
        date: new Date(slot.date),
        startTime: new Date(slot.startTime),
        endTime: new Date(slot.endTime),
        serviceId: savedService.id,
        available: true,
        dayOfWeek: slot.dayOfWeek,
        isRecurring: slot.isRecurring || false,
      });
      const savedTimeSlot = await this.timeSlotRepository.save(timeSlot);
      timeSlots.push(savedTimeSlot);
    }
    
    // Return the service with its time slots
    const serviceWithTimeSlots = await this.serviceRepository.findOne({
      where: { id: savedService.id },
      relations: ['timeSlots']
    });
    
    if (!serviceWithTimeSlots) {
      throw new NotFoundException('Service not found after creation');
    }
    
    return serviceWithTimeSlots;
  }

  async findAll(user: AuthUser, pagination: IPaginationOptions, category?: string, search?: string): Promise<Pagination<Service>> {
    const paginateOptions = {
      limit: pagination.limit || 10,
      page: pagination.page || 1,
    };
    
    const queryBuilder = this.serviceRepository.createQueryBuilder('services')
      .leftJoinAndSelect('services.provider', 'provider')
      .leftJoinAndSelect('services.timeSlots', 'timeSlots');
    
    // Apply filters
    if (category) {
      queryBuilder.andWhere('services.category = :category', { category });
    }
    
    if (search) {
      queryBuilder.andWhere('services.title LIKE :search', { search: `%${search}%` });
    }
    
    // Filter by provider if user is a provider
    if (user && user.role === 'provider') {
      queryBuilder.andWhere('provider.userId = :userId', { userId: user.userId });
    }
    
    queryBuilder.orderBy('services.createdAt', 'DESC');

    return paginate(queryBuilder, paginateOptions);
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['provider', 'timeSlots'],
    });
    
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    
    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceValidation, userId: number): Promise<Service> {
    const service = await this.findOne(id);
    
    // Check if the service belongs to the provider (compare provider's userId)
    if (service.provider?.userId !== userId) {
      throw new ForbiddenException('You can only update your own services');
    }
    
    await this.serviceRepository.update(id, updateServiceDto);
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const service = await this.findOne(id);
    
    // Check if the service belongs to the provider (compare provider's userId)
    if (service.provider?.userId !== userId) {
      throw new ForbiddenException('You can only delete your own services');
    }
    
    await this.serviceRepository.delete(id);
  }
}
