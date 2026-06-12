import { Module } from '@nestjs/common';
import { PsFileModule } from './ps-file/ps-file.module';
import { PsCiModule } from './ps-ci/ps-ci.module';
import { PsRPModule } from './ps-rp/ps-rp.module';

@Module({
    imports: [PsFileModule, PsCiModule, PsRPModule],
})
export class PsFormModule {}
