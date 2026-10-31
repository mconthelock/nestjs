import { Body, Controller, Post } from '@nestjs/common';
import { StockPartFollowService } from './stock_part_follow.service';
import { CreateStockPartFollowDto } from './dto/create.dto';

@Controller('workload/stock-part-follow')
export class StockPartFollowController {
    constructor(private readonly service: StockPartFollowService) {}

    @Post()
    create(@Body() dto: CreateStockPartFollowDto) {
        return this.service.create(dto);
    }
}
