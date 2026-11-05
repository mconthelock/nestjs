import { Module } from '@nestjs/common';
import { StockPartFollowService } from './stock_part_follow.service';
import { StockPartFollowController } from './stock_part_follow.controller';
import { StockPartFollowRepository } from './stock_part_follow.repository';

@Module({
    controllers: [StockPartFollowController],
    providers: [StockPartFollowService, StockPartFollowRepository],
})
export class StockPartFollowModule {}
