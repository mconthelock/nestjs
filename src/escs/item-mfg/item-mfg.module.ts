import { Module } from '@nestjs/common';
import { ItemMfgService } from './item-mfg.service';
import { ItemMfgController } from './item-mfg.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ITEM_MFG } from 'src/common/Entities/escs/table/ITEM_MFG.entity';
import { ItemMfgRepository } from './item-mfg.repository';
import { ItemMfgDeleteModule } from '../item-mfg-delete/item-mfg-delete.module';
import { ControlDrawingPisModule } from '../control-drawing-pis/control-drawing-pis.module';
import { ItemSheetMfgModule } from '../item-sheet-mfg/item-sheet-mfg.module';
import { ItemMfgListModule } from '../item-mfg-list/item-mfg-list.module';
import { ItemMfgHistoryModule } from '../item-mfg-history/item-mfg-history.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ITEM_MFG], 'escsConnection'),
    ItemSheetMfgModule,
    ItemMfgListModule,
    ItemMfgHistoryModule,
    ItemMfgDeleteModule,
    ControlDrawingPisModule,
  ],
  controllers: [ItemMfgController],
  providers: [ItemMfgService, ItemMfgRepository],
  exports: [ItemMfgService],
})
export class ItemMfgModule {}
