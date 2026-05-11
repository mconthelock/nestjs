import { Module } from '@nestjs/common';
import { GpRbModule, ShowCusStampGpRbModule, ShowstampGpRbModule } from './gp-rb/gp-rb.module';

@Module({
  imports: [GpRbModule, ShowstampGpRbModule, ShowCusStampGpRbModule],
})
export class GpformModule {}

