import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Service } from '../entities/services.entity';

@Injectable()
export class ServiceRepository extends Repository<Service> {
  constructor(dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }
}
