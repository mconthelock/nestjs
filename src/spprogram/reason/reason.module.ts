import { Module } from '@nestjs/common';
import { ReasonService } from './reason.service';
import { ReasonController } from './reason.controller';

@Module({
  controllers: [ReasonController],
  providers: [ReasonService],
})
export class ReasonModule {}
