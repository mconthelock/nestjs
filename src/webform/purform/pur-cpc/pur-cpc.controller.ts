import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PurCpcService } from './services/pur-cpc.service';
import { CondComparisonPriceService } from './services/cond_comparison_price.service';
import {
    PriceComparisonDto,
    PriceComparisonPlannerDto,
} from './dto/price-comparison.dto';

@Controller('purform/pur-cpc')
export class PurCpcController {
    constructor(
        private readonly service: PurCpcService,
        private readonly condComparisonPriceService: CondComparisonPriceService,
    ) {}

    @Get('cond-comparison-price/active')
    getActive() {
        return this.condComparisonPriceService.getActive();
    }

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
