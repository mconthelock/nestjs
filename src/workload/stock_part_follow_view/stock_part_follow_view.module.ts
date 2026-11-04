import { Module } from '@nestjs/common';
import { StockPartFollowViewService } from './stock_part_follow_view.service';
import { StockPartFollowViewController } from './stock_part_follow_view.controller';
import { StockPartFollowViewRepository } from './stock_part_follow_view.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { STOCK_PART_FOLLOW_VIEW } from 'src/common/Entities/workload/views/STOCK_PART_FOLLOW_VIEW.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        STOCK_PART_FOLLOW_VIEW,
    ], 'mitsuConnection'),
    ],
    controllers: [StockPartFollowViewController],
    providers: [StockPartFollowViewService, StockPartFollowViewRepository],
})
export class StockPartFollowViewModule {}
