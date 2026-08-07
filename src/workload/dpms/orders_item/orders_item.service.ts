import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { CreateOrdersItemDto } from './dto/create-orders_item.dto';
import { UpdateOrdersItemDto } from './dto/update-orders_item.dto';
import { SearchOrdersItemDto } from './dto/search-orders_item.dto';

import { DpmsOrdersItem } from 'src/common/Entities/workload/table/DPMS_ORDERS_ITEM.entity';
@Injectable()
export class OrdersItemService {
    constructor(
        @InjectRepository(DpmsOrdersItem, 'workloadConnection')
        private readonly dpmsitem: Repository<DpmsOrdersItem>,
    ) {}

    async search(dto: SearchOrdersItemDto) {
        const qb = this.dpmsitem.createQueryBuilder('dpmsitem');
        await applyDynamicFilters(qb, dto, 'dpmsitem');
        return qb.getMany();
    }
}
