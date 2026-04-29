import { Module } from '@nestjs/common';
import { GpRbModule } from './gp-rb/gp-rb.module';
import { GpOtModule } from './gp-ot/gp-ot.module';
@Module({
    imports: [GpRbModule, GpOtModule],
})
export class GPFormModule {}
