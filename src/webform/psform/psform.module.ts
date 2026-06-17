import { Module } from '@nestjs/common';
import { PsFileModule } from './ps-file/ps-file.module';
import { PsCiModule } from './ps-ci/ps-ci.module';
import { PsCihModule } from './ps-cih/ps-cih.module';
import { PsRPModule } from './ps-rp/ps-rp.module';
import { PsVarModule } from './ps-var/ps-var.module';

@Module({
    imports: [PsFileModule, PsCiModule, PsCihModule, PsRPModule, PsVarModule],
})
export class PsFormModule {}
