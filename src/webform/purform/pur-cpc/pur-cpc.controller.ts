import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PurCpcService } from './pur-cpc.service';
import { PriceComparisonDto, PriceComparisonPlannerDto } from './dto/price-comparison.dto';
import { IimService as Iim400Service } from 'src/as400/bpcsfvnew/iim/iim.service';

@Controller('purform/pur-cpc')
export class PurCpcController {
    constructor(
        private readonly service: PurCpcService,
        private readonly iim400Service: Iim400Service,
    ) {}

    @Post('planner-compare-sheet')
    async findPlannerCompareSheet(@Body() data: PriceComparisonPlannerDto) {
        return await this.service.findPlannerCompareSheet(data);
    }

    @Post('Price-Comparison')
    async priceComparison(@Body() data: PriceComparisonDto) {
        return await this.service.getPriceComparison(data);
    }

    @Post()
    async create(@Body() data: any) {
        return await this.service.create(data);
    }
}
