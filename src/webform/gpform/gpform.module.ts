import { Module } from '@nestjs/common';
import { GpFileModule } from './gp-file/gp-file.module';
import { GpRbModule } from './gp-rb/gp-rb.module';
import { GpGarModule } from './gp-gar/gp-gar.module';

@Module({
    imports: [GpRbModule, GpFileModule, GpGarModule]
})
export class GpformModule {}
