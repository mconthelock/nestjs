import { Module } from '@nestjs/common';
import { ItemMfgHistoryService } from './item-mfg-history.service';
import { ItemMfgHistoryController } from './item-mfg-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemMfgHistoryRepository } from './item-mfg-history.repository';

@Module({
  imports: [TypeOrmModule.forFeature([], 'escsConnection')],
  controllers: [ItemMfgHistoryController],
  providers: [ItemMfgHistoryService, ItemMfgHistoryRepository],
  exports: [ItemMfgHistoryService],
})
export class ItemMfgHistoryModule {}
