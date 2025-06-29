import { Module } from '@nestjs/common';
import { WorkpicService } from './workpic.service';
import { WorkpicController } from './workpic.controller';

@Module({
  controllers: [WorkpicController],
  providers: [WorkpicService],
})
export class WorkpicModule {}
