import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { SearchOrdersItemDto } from 'src/workload/dpms/orders_item/dto/search-orders_item.dto';

import { Problemaster } from 'src/common/Entities/workload/table/DPMS_PROBLEM_MASTER.entity';
import { DpmsOrdersItem } from 'src/common/Entities/workload/table/DPMS_ORDERS_ITEM.entity';

@Injectable()
export class ProblemMasterService {
    constructor(
        @InjectRepository(Problemaster, 'workloadConnection')
        private readonly problem: Repository<Problemaster>,

        @InjectRepository(DpmsOrdersItem, 'workloadConnection')
        private readonly dpmsitem: Repository<DpmsOrdersItem>,
    ) {}

    async findAll() {
        return this.problem.find();
    }

    async search(dto: SearchOrdersItemDto) {
        const qb = this.dpmsitem
            .createQueryBuilder('dpmsitem')
            .innerJoinAndSelect('dpmsitem.orders', 'orders')
            .innerJoinAndSelect('dpmsitem.problem', 'problem')
            .innerJoinAndSelect('dpmsitem.schedule', 'schedule');
        await applyDynamicFilters(qb, dto, 'dpmsitem');
        return qb.getMany();
    }
}
