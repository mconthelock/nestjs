import { Module } from '@nestjs/common';
import { GpFileModule } from './gp-file/gp-file.module';
import { GpRbModule } from './gp-rb/gp-rb.module';
import { GpGarModule } from './gp-gar/gp-gar.module';
import { GpTphModule } from './gp-tph/gp-tph.module';
import { GpOtModule } from './gp-ot/gp-ot.module';
@Module({
    imports: [GpRbModule, GpFileModule, GpGarModule, GpTphModule, GpOtModule],
})
export class GpformModule {}
