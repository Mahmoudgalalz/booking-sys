import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/shared/auth/auth.module';
import { SharedModule } from './modules/shared/shared.module';
import { UsersModule } from './modules/users/users.module';
import { ProvidersModule } from './modules/providers/providers.module';
import { ServicesModule } from './modules/services/services.module';
import { SlotsModule } from './modules/slots/slots.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { IsUniqueConstraint } from './modules/shared/decorators/validation/rules/unique.decorator';
import { IsExistingConstraint } from './modules/shared/decorators/validation/rules/exists.decorator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('database.synchronize'),
      }),
    }),
    SharedModule,
    AuthModule,
    UsersModule,
    ProvidersModule,
    ServicesModule,
    SlotsModule,
    BookingsModule,
    SchedulingModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint, IsExistingConstraint],
  exports: [IsUniqueConstraint]
})
export class AppModule {}
