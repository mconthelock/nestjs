import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersItemService } from './orders_item.service';
import { OrdersItemController } from './orders_item.controller';

import { DpmsOrdersItem } from 'src/common/Entities/workload/table/DPMS_ORDERS_ITEM.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DpmsOrdersItem], 'workloadConnection')],
    controllers: [OrdersItemController],
    providers: [OrdersItemService],
})
export class OrdersItemModule {}
