import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulerService } from './scheduler.service';
import { SchedulerController } from './scheduler.controller';
import { Scheduler } from './entities/scheduler.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Scheduler], 'amecConnection')],
  controllers: [SchedulerController],
  providers: [SchedulerService],
})
export class SchedulerModule {}
