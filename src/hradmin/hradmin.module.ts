import { Module } from '@nestjs/common';
import { MasterkeyModule } from './masterkey/masterkey.module';
import { TwidocModule } from './twidoc/twidoc.module';

@Module({
  imports: [MasterkeyModule, TwidocModule]
})
export class HradminModule {}
