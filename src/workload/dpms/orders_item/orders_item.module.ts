import { Module } from '@nestjs/common';
import { OrdersItemService } from './orders_item.service';
import { OrdersItemController } from './orders_item.controller';

@Module({
  controllers: [OrdersItemController],
  providers: [OrdersItemService],
})
export class OrdersItemModule {}
