import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Role } from '../entities/roles.entity';

@Injectable()
export class RoleRepository extends Repository<Role> {
  constructor(dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }
}
