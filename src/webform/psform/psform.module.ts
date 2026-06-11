import { Module } from '@nestjs/common';
import { PsFileModule } from './ps-file/ps-file.module';
import { PsCiModule } from './ps-ci/ps-ci.module';

@Module({
    imports: [PsFileModule, PsCiModule],
})
export class PsFormModule {}
