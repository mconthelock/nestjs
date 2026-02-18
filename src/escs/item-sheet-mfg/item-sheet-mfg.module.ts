import { Module } from '@nestjs/common';
import { ItemSheetMfgService } from './item-sheet-mfg.service';
import { ItemSheetMfgController } from './item-sheet-mfg.controller';
import { ITEM_SHEET_MFG } from 'src/common/Entities/escs/table/ITEM_SHEET_MFG.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemSheetMfgRepository } from './item-sheet-mfg.repository';
import { ItemMfgListModule } from '../item-mfg-list/item-mfg-list.module';
import { ItemMfgHistoryModule } from '../item-mfg-history/item-mfg-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ITEM_SHEET_MFG], 'escsConnection'),
    ItemMfgListModule,
    ItemMfgHistoryModule,
  ],
  controllers: [ItemSheetMfgController],
  providers: [ItemSheetMfgService, ItemSheetMfgRepository],
  exports: [ItemSheetMfgService],
})
export class ItemSheetMfgModule {}
