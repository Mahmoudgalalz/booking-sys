import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { SharedModule } from '../shared/shared.module';
import { SlotsModule } from '../slots/slots.module';

@Module({
  imports: [SharedModule, SlotsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
