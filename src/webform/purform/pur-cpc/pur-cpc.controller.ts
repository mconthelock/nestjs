import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { PurCpcService } from './pur-cpc.service';
// import { IimService } from 'src/datacenter/iim/iim.service';
import { IimService as Iim400Service } from 'src/as400/bpcsfvnew/iim/iim.service';
import { PriceComparisonDto } from './dto/price-comparison.dto';

@Controller('purform/pur-cpc')
export class PurCpcController {
    constructor(
        private readonly service: PurCpcService,
        // private readonly iimService: IimService,
        private readonly iim400Service: Iim400Service,
    ) {}

    @Get('planner-compare-sheet/:planner')
    async findPlannerCompareSheet(@Param('planner') planner: string) {
        return await this.iim400Service.findPlannerCompareSheet(
            planner.includes(',') ? planner.split(',') : planner,
        );
    }

    @Post('Price-Comparison')
    async priceComparison(@Body() data: PriceComparisonDto) {
        return await this.iim400Service.priceComparison(data);
    }
}
