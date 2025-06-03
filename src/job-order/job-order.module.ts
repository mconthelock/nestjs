import { Module } from '@nestjs/common';
import { JobOrderService } from './job-order.service';
import { JobOrderController } from './job-order.controller';

@Module({
  controllers: [JobOrderController],
  providers: [JobOrderService],
})
export class JobOrderModule {}
