import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [
    SharedModule,
  ],
  providers: [SchedulingService],
  exports: [SchedulingService],
})
export class SchedulingModule {}
