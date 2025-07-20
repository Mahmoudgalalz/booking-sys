import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Booking } from './entities/bookings.entity';
import { Provider } from './entities/providers.entity';
import { TimeSlot } from './entities/time-slots.entity';
import { Service } from './entities/services.entity';
import { User } from './entities/users.entity';
import { UserRepository } from './repositories/user.repository';
import { ServiceRepository } from './repositories/service.repository';
import { TimeSlotRepository } from './repositories/time-slot.repository';
import { BookingRepository } from './repositories/booking.repository';
import { ProviderRepository } from './repositories/provider.repository';
import { UploadController } from './upload/upload.controller';
import { FileUploadService } from './upload/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Provider,
      Service,
      TimeSlot,
      User,
    ]),
    ConfigModule,
  ],
  providers: [
    UserRepository,
    ServiceRepository,
    TimeSlotRepository,
    BookingRepository,
    ProviderRepository,
    FileUploadService,
  ],
  exports: [
    TypeOrmModule,
    UserRepository,
    ServiceRepository,
    TimeSlotRepository,
    BookingRepository,
    ProviderRepository,
  ],
  controllers: [UploadController]
})
export class SharedModule {}
