import { Controller, Body, Post, Get } from '@nestjs/common';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { DevplanService } from './devplan.service';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('docinv/plan')
export class DevplanController {
    constructor(private readonly plan: DevplanService) {}

    @Post('project')
    search(@Body() dto: FiltersDto) {
        return this.plan.search(dto);
    }

    @Get('category')
    getCategory() {
        return this.plan.getCategory();
    }
}
