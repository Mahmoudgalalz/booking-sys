import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { EventEmitterModule } from '@nestjs/event-emitter';
// import { CqrsModule } from '@nestjs/cqrs';
// import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
// import { ServeStaticModule } from '@nestjs/serve-static';
// import { join } from 'path';
// import { MulterModule } from '@nestjs/platform-express/multer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/shared/auth/auth.module';
import { SharedModule } from './modules/shared/shared.module';
import { IsUniqueConstraint } from './modules/shared/decorators/validation/rules/unique.decorator';
import { IsExistingConstraint } from './modules/shared/decorators/validation/rules/exists.decorator';

@Module({
  imports: [
    // EventEmitterModule.forRoot(),
    // CqrsModule.forRoot(),
    // ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'uploads'),
    //   serveRoot: '/uploads',
    // }),
    // MulterModule.register({
    //   dest: './uploads',
    // }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint, IsExistingConstraint],
  exports: [IsUniqueConstraint]
})
export class AppModule {}
