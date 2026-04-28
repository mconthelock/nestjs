import { Module } from '@nestjs/common';
import { GpRbModule } from './gp-rb/gp-rb.module';

@Module({
  imports: [GpRbModule]
})
export class GpformModule {}
