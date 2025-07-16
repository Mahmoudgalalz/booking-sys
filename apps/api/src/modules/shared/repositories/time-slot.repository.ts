import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TimeSlot } from '../entities/time-slots.entity';

@Injectable()
export class TimeSlotRepository extends Repository<TimeSlot> {
  constructor(dataSource: DataSource) {
    super(TimeSlot, dataSource.createEntityManager());
  }
}
