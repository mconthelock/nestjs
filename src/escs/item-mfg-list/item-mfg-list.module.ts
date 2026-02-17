import { Module } from '@nestjs/common';
import { ItemMfgListService } from './item-mfg-list.service';
import { ItemMfgListController } from './item-mfg-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemMfgListRepository } from './item-mfg-list.repository';

@Module({
  imports: [TypeOrmModule.forFeature([], 'escsConnection')],
  controllers: [ItemMfgListController],
  providers: [ItemMfgListService, ItemMfgListRepository],
  exports: [ItemMfgListService],
})
export class ItemMfgListModule {}
