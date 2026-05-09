import { Module } from '@nestjs/common';
import { GpRbModule } from './gp-rb/gp-rb.module';
import { GpFileModule } from './gp-file/gp-file.module';

@Module({
    imports: [GpRbModule, GpFileModule],
})
export class GpformModule {}
