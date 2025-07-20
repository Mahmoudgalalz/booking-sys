import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Like } from 'typeorm';
import { ServiceRepository } from '../shared/repositories/service.repository';
import { ProviderRepository } from '../shared/repositories/provider.repository';
import { CreateServiceValidation } from './validation/create-service.validation';
import { UpdateServiceValidation } from './validation/update-service.validation';
import { Service } from '../shared/entities/services.entity';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class ServicesService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async create(createServiceDto: CreateServiceValidation, userId: number): Promise<Service> {
    let provider = await this.providerRepository.findOne({
      where: { userId }
    });
    
    const service = this.serviceRepository.create({
      ...createServiceDto,
      providerId: provider?.id,
    });
    
    return this.serviceRepository.save(service);
  }

  async findAll(userId: number, pagination: IPaginationOptions, category?: string, search?: string): Promise<Pagination<Service>> {
    const whereCondition: any = {};
    
    if (category) {
      whereCondition.category = category;
    }
    
    if (search) {
      whereCondition.title = Like(`%${search}%`);
    }
    
    const services = this.serviceRepository.createQueryBuilder('service')
      .leftJoinAndSelect('service.provider', 'provider')
      .where(whereCondition)
    if(userId) {
      services.andWhere('provider.userId = :userId', { userId });
    }

    return paginate(services, pagination);
  }

  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['provider', 'slots'],
    });
    
    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
    
    return service;
  }

  async update(id: number, updateServiceDto: UpdateServiceValidation, providerId: number): Promise<Service> {
    const service = await this.findOne(id);
    
    if (service.providerId !== providerId) {
      throw new ForbiddenException('You can only update your own services');
    }
    
    await this.serviceRepository.update(id, updateServiceDto);
    return this.findOne(id);
  }

  async remove(id: number, providerId: number): Promise<void> {
    const service = await this.findOne(id);
    
    if (service.providerId !== providerId) {
      throw new ForbiddenException('You can only delete your own services');
    }
    
    await this.serviceRepository.delete(id);
  }
}
