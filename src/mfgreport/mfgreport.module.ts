import { Module } from '@nestjs/common';
import { DpmsModule } from './dpms/dpms.module';

@Module({
    imports: [DpmsModule, MfgReportModule],
})
export class MfgReportModule {}
