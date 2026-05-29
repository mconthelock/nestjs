import { Module } from '@nestjs/common';
import { GpFileModule } from './gp-file/gp-file.module';
import { GpRbModule } from './gp-rb/gp-rb.module';

@Module({
    imports: [GpRbModule, GpFileModule],
})
export class GpformModule {}
