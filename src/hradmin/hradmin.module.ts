import { Module } from '@nestjs/common';
import { MasterkeyModule } from './masterkey/masterkey.module';
import { TwidocModule } from './twidoc/twidoc.module';
import { PromoteModule } from './promote/promote.module';

@Module({
  imports: [MasterkeyModule, TwidocModule, PromoteModule]
})
export class HradminModule {}
