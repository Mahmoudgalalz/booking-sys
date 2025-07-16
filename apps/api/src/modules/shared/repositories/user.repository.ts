import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/users.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
}
