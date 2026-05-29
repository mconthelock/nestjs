import { Module } from '@nestjs/common';
import { GpFileModule } from './gp-file/gp-file.module';
import { GpRbModule, ShowCusStampGpRbModule, ShowstampGpRbModule } from './gp-rb/gp-rb.module';
import { GpGarModule } from './gp-gar/gp-gar.module';

@Module({
    imports: [GpRbModule, GpFileModule, GpGarModule, ShowstampGpRbModule, ShowCusStampGpRbModule],
})
export class GpformModule {}

