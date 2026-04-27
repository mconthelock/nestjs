import { Module } from '@nestjs/common';
import { GpRbService } from './gp-rb.service';
import { GpRbController } from './gp-rb.controller';

@Module({
  controllers: [GpRbController],
  providers: [GpRbService],
})
export class GpRbModule {}
