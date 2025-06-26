import { Module } from '@nestjs/common';
import { LockPisModule } from './lock-pis/lock-pis.module';
@Module({
  imports: [LockPisModule],
  providers: [],
})
export class PisModule {}
