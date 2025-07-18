import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulingService } from './scheduling.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    SharedModule,
  ],
  providers: [SchedulingService],
})
export class SchedulingModule {}
