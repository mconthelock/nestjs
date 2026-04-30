import { Module } from '@nestjs/common';
import { StyPatrolService } from './sty-patrol.service';
import { StyPatrolController } from './sty-patrol.controller';

@Module({
  controllers: [StyPatrolController],
  providers: [StyPatrolService],
})
export class StyPatrolModule {}
