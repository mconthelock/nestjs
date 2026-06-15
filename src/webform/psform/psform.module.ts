import { Module } from '@nestjs/common';
import { PsFileModule } from './ps-file/ps-file.module';
import { PsCiModule } from './ps-ci/ps-ci.module';
import { PsCihModule } from './ps-cih/ps-cih.module';

@Module({
    imports: [PsFileModule, PsCiModule, PsCihModule],
})
export class PsFormModule {}
