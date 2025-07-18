import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto, providerId: number): Promise<Service> {
    const service = this.serviceRepository.create({
      ...createServiceDto,
      providerId,
    });
    return this.serviceRepository.save(service);
  }

  async findAll(category?: string, search?: string): Promise<Service[]> {
    const whereCondition: any = {};
    
    if (category) {
      whereCondition.category = category;
    }
    
    if (search) {
      whereCondition.title = Like(`%${search}%`);
    }
    
    return this.serviceRepository.find({
      where: whereCondition,
      relations: ['provider'],
    });
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

  async update(id: number, updateServiceDto: UpdateServiceDto, providerId: number): Promise<Service> {
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
