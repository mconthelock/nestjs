import { Module } from '@nestjs/common';
import { DpmsModule } from './dpms/dpms.module';

@Module({
    imports: [DpmsModule],
})
export class MfgReportModule {}
