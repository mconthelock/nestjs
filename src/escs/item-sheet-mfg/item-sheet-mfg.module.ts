import { Module } from '@nestjs/common';
import { ItemSheetMfgService } from './item-sheet-mfg.service';
import { ItemSheetMfgController } from './item-sheet-mfg.controller';
import { ITEM_SHEET_MFG } from 'src/common/Entities/escs/table/ITEM_SHEET_MFG.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemSheetMfgRepository } from './item-sheet-mfg.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ITEM_SHEET_MFG], 'escsConnection')],
  controllers: [ItemSheetMfgController],
  providers: [ItemSheetMfgService, ItemSheetMfgRepository],
  exports: [ItemSheetMfgService],
})
export class ItemSheetMfgModule {}
