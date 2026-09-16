import { Controller, Get, Post, Param } from '@nestjs/common';
import { PurCpcService } from './pur-cpc.service';
import { IimService } from 'src/datacenter/iim/iim.service';

@Controller('purform/pur-cpc')
export class PurCpcController {
    constructor(
        private readonly service: PurCpcService,
        private readonly iimService: IimService,
    ) {}

    @Get('planner-compare-sheet/:planner')
    async findPlannerCompareSheet(@Param('planner') planner: string) {
        return await this.iimService.findPlannerCompareSheet(planner);
    }
}
