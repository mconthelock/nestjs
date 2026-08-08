import { Controller, Get, Post, Body } from '@nestjs/common';
import { ProblemService } from './problem.service';
import { SearchProblemOrdersDto } from './dto/search-problem_orders.dto';

@Controller('workload/problem')
export class ProblemController {
    constructor(private readonly problem: ProblemService) {}

    @Get('master')
    findAll() {
        return this.problem.findAll();
    }

    @Get('delayvalues')
    findOrders() {
        return this.problem.findDelayValues();
    }

    @Get('serious')
    findSerious() {
        return this.problem.findSerious();
    }

    @Post('orders')
    search(@Body() dto: SearchProblemOrdersDto) {
        return this.problem.search(dto);
    }
}
