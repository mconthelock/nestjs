import { Module } from '@nestjs/common';
import { OrderListModule } from './orderlist/orderlist.module';

@Module({
  imports: [
    OrderListModule
  ],
})
export class JobOrderModule {}
