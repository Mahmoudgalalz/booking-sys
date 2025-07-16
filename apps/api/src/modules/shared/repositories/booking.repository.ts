import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Booking } from '../entities/bookings.entity';

@Injectable()
export class BookingRepository extends Repository<Booking> {
  constructor(dataSource: DataSource) {
    super(Booking, dataSource.createEntityManager());
  }
}
