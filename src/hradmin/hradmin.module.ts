import { Module } from '@nestjs/common';
import { MasterkeyModule } from './masterkey/masterkey.module';
import { TwidocModule } from './twidoc/twidoc.module';
import { PromoteModule } from './promote/promote.module';
import { SecretlogModule } from './secretlog/secretlog.module';
import { SchedulerModule } from './scheduler/scheduler.module';

@Module({
  imports: [MasterkeyModule, TwidocModule, PromoteModule, SecretlogModule, SchedulerModule]
})
export class HradminModule {}
