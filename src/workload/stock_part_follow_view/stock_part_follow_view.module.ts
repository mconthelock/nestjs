import { Module } from '@nestjs/common';
import { StockPartFollowViewService } from './stock_part_follow_view.service';
import { StockPartFollowViewController } from './stock_part_follow_view.controller';
import { StockPartFollowViewRepository } from './stock_part_follow_view.repository';

@Module({
    controllers: [StockPartFollowViewController],
    providers: [StockPartFollowViewService, StockPartFollowViewRepository],
})
export class StockPartFollowViewModule {}
