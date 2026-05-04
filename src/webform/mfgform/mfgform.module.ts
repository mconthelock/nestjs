import { Module } from '@nestjs/common';
import { MfgEdrModule } from './mfg-edr/mfg-edr.module';


@Module({
  imports: [MfgEdrModule],
})
export class mfgformModule {}
