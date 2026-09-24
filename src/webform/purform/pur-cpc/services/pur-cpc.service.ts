import { Injectable } from '@nestjs/common';
import { PurCpcRepository } from '../repository/pur-cpc.repository';
import { PurcpcProcPlanViewRepository } from '../repository/purcpc_proc_list_view.repository';
import { PurcpcProcCompareViewRepository } from '../repository/purcpc_proc_compare_view.repository';
import {
    PriceComparisonDto,
    PriceComparisonPlannerDto,
} from '../dto/price-comparison.dto';

import { IimService as Iim400Service } from 'src/as400/bpcsfvnew/iim/iim.service';

@Injectable()
export class PurCpcService {
    constructor(
        private readonly repo: PurCpcRepository,
        private readonly iim400Service: Iim400Service,
        private readonly purcpcProcPlanViewRepo: PurcpcProcPlanViewRepository,
        private readonly purcpcProcCompareViewRepo: PurcpcProcCompareViewRepository,
    ) {}

    async create(data: any) {
        return await this.repo.create(data);
    }

    async getPriceComparison(data: PriceComparisonDto) {
        try {
            switch (data.SYSTEM) {
                case 'AS400':
                    return await this.iim400Service.priceComparison(data);
                case 'PROCUREMENT':
                    return await this.purcpcProcCompareViewRepo.findByItemCode(
                        data.ITEM,
                    );
                default:
                    throw new Error(`Unsupported SYSTEM: ${data.SYSTEM}`);
            }
        } catch (error) {
            throw error;
        }
    }

    async findPlannerCompareSheet(data: PriceComparisonPlannerDto) {
        try {
            switch (data.SYSTEM) {
                case 'AS400':
                    return await this.iim400Service.findPlannerCompareSheet(
                        data.PLANNER,
                    );
                case 'PROCUREMENT':
                    return await this.purcpcProcPlanViewRepo.findByPlanner(
                        data.PLANNER,
                    );
                default:
                    throw new Error(`Unsupported SYSTEM: ${data.SYSTEM}`);
            }
        } catch (error) {
            throw error;
        }
    }
}
