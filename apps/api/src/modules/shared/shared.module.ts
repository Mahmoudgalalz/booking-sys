import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Booking } from './entities/bookings.entity';
import { Provider } from './entities/providers.entity';
import { TimeSlot } from './entities/time-slots.entity';
import { Role } from './entities/roles.entity';
import { Service } from './entities/services.entity';
import { User } from './entities/users.entity';
import { UserRepository } from './repositories/user.repository';
import { RoleRepository } from './repositories/role.repository';
import { ServiceRepository } from './repositories/service.repository';
import { TimeSlotRepository } from './repositories/time-slot.repository';
import { BookingRepository } from './repositories/booking.repository';
import { ProviderRepository } from './repositories/provider.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      Provider,
      Role,
      Service,
      TimeSlot,
      User,
    ]),
    ConfigModule,
  ],
  providers: [
    UserRepository,
    RoleRepository,
    ServiceRepository,
    TimeSlotRepository,
    BookingRepository,
    ProviderRepository,
  ],
  exports: [
    TypeOrmModule,
    UserRepository,
    RoleRepository,
    ServiceRepository,
    TimeSlotRepository,
    BookingRepository,
    ProviderRepository,
  ],
})
export class SharedModule {}
