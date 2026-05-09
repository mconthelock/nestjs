import { Module } from '@nestjs/common';
import { MfgEdrModule } from './mfg-edr/mfg-edr.module';
import { MfgFileModule } from './mfg-file/mfg-file.module';


@Module({
  imports: [MfgEdrModule, MfgFileModule],
})
export class mfgformModule {}
