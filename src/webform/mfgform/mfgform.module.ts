import { Module } from '@nestjs/common';
import { MfgEdrModule } from './mfg-edr/mfg-edr.module';
import { MfgFileModule } from './mfg-file/mfg-file.module';
import { MfgOrModule } from './mfg-or/mfg-or.module';
import { RootcauseModule } from './mfg-edr/rootcause/rootcause.module';

@Module({
  imports: [MfgEdrModule, MfgFileModule, MfgOrModule, RootcauseModule],
})
export class mfgformModule {}
