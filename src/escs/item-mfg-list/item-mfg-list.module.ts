import { Module } from '@nestjs/common';
import { ItemMfgListService } from './item-mfg-list.service';
import { ItemMfgListController } from './item-mfg-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemMfgListRepository } from './item-mfg-list.repository';
import { ItemMfgHistoryModule } from '../item-mfg-history/item-mfg-history.module';
import { ITEM_MFG_LIST } from 'src/common/Entities/escs/table/ITEM_MFG_LIST.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ITEM_MFG_LIST], 'mitsuConnection'), ItemMfgHistoryModule],
    controllers: [ItemMfgListController],
    providers: [ItemMfgListService, ItemMfgListRepository],
    exports: [ItemMfgListService],
})
export class ItemMfgListModule {}
