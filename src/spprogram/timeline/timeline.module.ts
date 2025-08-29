import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimelineService } from './timeline.service';
import { Timeline } from './entities/timeline.entity';
import { TimelineController } from './timeline.controller';

@Module({
  controllers: [TimelineController],
  imports: [TypeOrmModule.forFeature([Timeline], 'spsysConnection')],
  providers: [TimelineService],
})
export class TimelineModule {}
