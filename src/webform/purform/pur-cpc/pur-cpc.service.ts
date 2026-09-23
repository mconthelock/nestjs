import { Injectable } from '@nestjs/common';
import { PurCpcRepository } from './pur-cpc.repository';
import { PriceComparisonDto, PriceComparisonPlannerDto } from './dto/price-comparison.dto';

import { IimService as Iim400Service } from 'src/as400/bpcsfvnew/iim/iim.service';

@Injectable()
export class PurCpcService {
    constructor(
        private readonly repo: PurCpcRepository,
        private readonly iim400Service: Iim400Service,
    ) {}

    async create(data: any) {
        return await this.repo.create(data);
    }

    async getPriceComparison(data: PriceComparisonDto) {
        if(data.DB == 'AS400'){
            return await this.iim400Service.priceComparison(data);
        }
        // return await this.repo.getPriceComparison(data);
    }

    async findPlannerCompareSheet(data: PriceComparisonPlannerDto) {
        if(data.DB == 'AS400'){
            return await this.iim400Service.findPlannerCompareSheet(data.PLANNER);
        }
        // return await this.repo.findPlannerCompareSheet(data);
    }
}
