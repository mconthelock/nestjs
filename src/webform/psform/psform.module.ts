import { Module } from '@nestjs/common';
import { PsFileModule } from './ps-file/ps-file.module';
import { PsRPModule } from './ps-rp/ps-rp.module';

@Module({
    imports: [PsFileModule, PsRPModule],
})
export class PsFormModule {}
