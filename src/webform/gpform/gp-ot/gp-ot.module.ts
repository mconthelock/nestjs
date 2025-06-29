import { Module } from '@nestjs/common';
import { GpOtService } from './gp-ot.service';
import { GpOtController } from './gp-ot.controller';

@Module({
  controllers: [GpOtController],
  providers: [GpOtService],
})
export class GpOtModule {}
