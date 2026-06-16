import { Module } from '@nestjs/common';
import { MfgEdrModule } from './mfg-edr/mfg-edr.module';
import { MfgFileModule } from './mfg-file/mfg-file.module';
import { MfgOrModule } from './mfg-or/mfg-or.module';


@Module({
  imports: [MfgEdrModule, MfgFileModule, MfgOrModule],
})
export class mfgformModule {}
