import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';

import {
    PriceComparisonDto,
    PriceComparisonPlannerDto,
    PriceComparisonListDto,
} from './dto/price-comparison.dto';
import { CreateFormDto } from './dto/create-pcp-form.dto';


import { PurCpcService } from './services/purcpc_form.service';
import { CondComparisonPriceService } from './services/cond_comparison_price.service';

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
    @UseTransaction('webformConnection')
    async create(@Body() data: CreateFormDto) {
        return await this.service.create(data);
    }

    @Post('lists')
    async getLists(@Body() data: PriceComparisonListDto) {
        return await this.service.getLists(data);
    }
}
