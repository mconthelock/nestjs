import { Module } from '@nestjs/common';
import { OrderListModule } from './orderlist/orderlist.module';
import { SetRequestDateModule } from './set-request-date/set-request-date.module';

@Module({
  imports: [
    OrderListModule,
    SetRequestDateModule
  ],
})
export class JobOrderModule {}