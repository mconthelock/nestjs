import { Controller, Get } from '@nestjs/common';
import { StockPartFollowViewService } from './stock_part_follow_view.service';

@Controller('workload/stock-part-follow')
export class StockPartFollowViewController {
    constructor(private readonly service: StockPartFollowViewService) {}

    @Get()
    findAll() {
        return this.service.findAll();
    }
}
