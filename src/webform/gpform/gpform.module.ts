import { Module } from '@nestjs/common';
import { GpFileModule } from './gp-file/gp-file.module';
import { GpRbModule } from './gp-rb/gp-rb.module';
import { GpOtModule } from './gp-ot/gp-ot.module';

@Module({
    imports: [GpRbModule, GpFileModule, GpOtModule],
})
export class GpformModule {}
