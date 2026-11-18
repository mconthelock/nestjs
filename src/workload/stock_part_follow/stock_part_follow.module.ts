import { Module } from '@nestjs/common';
import { StockPartFollowService } from './stock_part_follow.service';
import { StockPartFollowController } from './stock_part_follow.controller';
import { StockPartFollowRepository } from './stock_part_follow.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { STOCK_PART_FOLLOW } from 'src/common/Entities/workload/table/STOCK_PART_FOLLOW.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        STOCK_PART_FOLLOW,
    ], 'mitsuConnection'),
    ],
    controllers: [StockPartFollowController],
    providers: [StockPartFollowService, StockPartFollowRepository],
})
export class StockPartFollowModule {}
