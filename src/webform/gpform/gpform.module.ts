import { Module } from '@nestjs/common';
import { GpFileModule } from './gp-file/gp-file.module';
import { GpRbModule, ShowCusStampGpRbModule, ShowstampGpRbModule } from './gp-rb/gp-rb.module';

@Module({
    imports: [GpRbModule, GpFileModule,  ShowstampGpRbModule, ShowCusStampGpRbModule],
})
export class GpformModule {}

