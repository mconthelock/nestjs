import { Module } from '@nestjs/common';
import { MfgEdrModule } from './mfg-edr/mfg-edr.module';
import { MfgFileModule } from './mfg-file/mfg-file.module';
import { MfgOrModule } from './mfg-or/mfg-or.module';
import { MfgVtrModule } from './mfg-vtr/mfg-vtr.module';

@Module({
    imports: [MfgEdrModule, MfgFileModule, MfgOrModule, MfgVtrModule],
})
export class MfgformModule {}
