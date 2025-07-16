import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Provider } from '../entities/providers.entity';

@Injectable()
export class ProviderRepository extends Repository<Provider> {
  constructor(dataSource: DataSource) {
    super(Provider, dataSource.createEntityManager());
  }
}
