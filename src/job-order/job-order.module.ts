import { Module } from '@nestjs/common';
import { JobOrderService } from './job-order.service';
import { JobOrderController } from './job-order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VJobOrder } from './entities/job-order.entity';

@Module({
     imports: [TypeOrmModule.forFeature([VJobOrder], 'amecConnection')],
  controllers: [JobOrderController],
  providers: [JobOrderService],
})
export class JobOrderModule {}
