import { Module } from '@nestjs/common';
import { GpFileModule } from './gp-file/gp-file.module';
import { GpRbModule } from './gp-rb/gp-rb.module';
import { GpGarModule } from './gp-gar/gp-gar.module';
import { GpTphModule } from './gp-tph/gp-tph.module';

@Module({
    imports: [GpRbModule, GpFileModule, GpGarModule, GpTphModule,]
})
export class GpformModule {}
