import { Module } from '@nestjs/common';
import { LockPisService } from './lock-pis.service';
import { LockPisGateway } from './lock-pis.gateway';

@Module({
  providers: [LockPisGateway, LockPisService],
})
export class LockPisModule {}
