import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DpmsOrdersItemService } from './orders_item.service';
import { DpmsOrdersItemController } from './orders_item.controller';

import { DpmsOrdersItem } from 'src/common/Entities/workload/table/DPMS_ORDERS_ITEM.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DpmsOrdersItem], 'workloadConnection')],
    controllers: [DpmsOrdersItemController],
    providers: [DpmsOrdersItemService],
})
export class DpmsOrdersItemModule {}
