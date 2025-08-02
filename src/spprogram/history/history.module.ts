import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryService } from './history.service';
import { History } from './entities/history.entity';
import { HistoryController } from './history.controller';

@Module({
  controllers: [HistoryController],
  imports: [TypeOrmModule.forFeature([History], 'amecConnection')],
  providers: [HistoryService],
  exports: [HistoryService],
})
export class HistoryModule {}
