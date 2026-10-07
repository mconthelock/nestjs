import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PurCpcService } from './services/purcpc_form.service';
import { CondComparisonPriceService } from './services/cond_comparison_price.service';
import {
    PriceComparisonDto,
    PriceComparisonPlannerDto,
} from './dto/price-comparison.dto';
import { CreatePcpFormDto } from './dto/create-pcp-form.dto';

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
    async create(@Body() data: CreatePcpFormDto) {
        return await this.service.create(data);
    }
}
