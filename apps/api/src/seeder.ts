import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { RoleSeeder } from './database/seeders/roles.seed';
import { Role } from './modules/shared/entities/roles.entity';
import { User } from './modules/shared/entities/users.entity';
import { Provider } from './modules/shared/entities/providers.entity';
import { Booking } from './modules/shared/entities/bookings.entity';
import { Service } from './modules/shared/entities/services.entity';
import { TimeSlot } from './modules/shared/entities/time-slots.entity';

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [
          Role,
          User,
          Provider,
          Booking,
          Service,
          TimeSlot,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Role, User, Provider, Booking, Service, TimeSlot]),
  ],
}).run([RoleSeeder]);
