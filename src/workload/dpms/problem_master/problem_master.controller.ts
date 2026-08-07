import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProblemMasterService } from './problem_master.service';

import { SearchOrdersItemDto } from 'src/workload/dpms/orders_item/dto/search-orders_item.dto';

@Controller('workload/problem-master')
export class ProblemMasterController {
    constructor(private readonly problemMasterService: ProblemMasterService) {}

    @Get()
    findAll() {
        return this.problemMasterService.findAll();
    }

    @Post('search')
    search(@Body() dto: SearchOrdersItemDto) {
        return this.problemMasterService.search(dto);
    }
}
