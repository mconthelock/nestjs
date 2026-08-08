import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { Problemaster } from 'src/common/Entities/workload/table/DPMS_PROBLEM_MASTER.entity';
import { DpmsOrdersItem } from 'src/common/Entities/workload/table/DPMS_ORDERS_ITEM.entity';
import { DelayValues } from 'src/common/Entities/workload/table/DELAY_VALUES.entity';
import { SeriousProblems } from 'src/common/Entities/workload/table/serious_problems.entity';

import { SearchProblemOrdersDto } from './dto/search-problem_orders.dto';

@Injectable()
export class ProblemService {
    constructor(
        @InjectRepository(Problemaster, 'workloadConnection')
        private readonly problem: Repository<Problemaster>,

        @InjectRepository(DpmsOrdersItem, 'workloadConnection')
        private readonly dpmsitem: Repository<DpmsOrdersItem>,

        @InjectRepository(DelayValues, 'workloadConnection')
        private readonly delay: Repository<DelayValues>,

        @InjectRepository(SeriousProblems, 'workloadConnection')
        private readonly serious: Repository<SeriousProblems>,
    ) {}

    async findAll() {
        return this.problem.find();
    }

    async findDelayValues() {
        return this.delay.find();
    }

    async findSerious() {
        return this.serious.find();
    }

    async search(dto: SearchProblemOrdersDto) {
        const qb = this.dpmsitem
            .createQueryBuilder('dpmsitem')
            .innerJoinAndSelect('dpmsitem.orders', 'orders')
            .innerJoinAndSelect('dpmsitem.problem', 'problem')
            .innerJoinAndSelect('dpmsitem.schedule', 'schedule');
        await applyDynamicFilters(qb, dto, 'dpmsitem');
        return qb.getMany();
    }
}
