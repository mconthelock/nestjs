import { Module } from '@nestjs/common';
import { MfgDrawingService } from './mfg-drawing.service';
import { MfgDrawingController } from './mfg-drawing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MFG_DRAWING } from 'src/common/Entities/escs/table/MFG_DRAWING.entity';
import { MfgDrawingRepository } from './mfg-drawing.repository';
import { MfgDrawingCreateChecksheetService } from './mfg-drawing-checksheet.service';
import { ItemMfgListModule } from '../item-mfg-list/item-mfg-list.module';
import { ItemMfgModule } from '../item-mfg/item-mfg.module';
import { ItemMfgDeleteModule } from '../item-mfg-delete/item-mfg-delete.module';
import { IdtagEfacLogModule } from 'src/workload/idtag-efac-log/idtag-efac-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MFG_DRAWING], 'escsConnection'),
    ItemMfgModule,
    ItemMfgListModule,
    ItemMfgDeleteModule,
    IdtagEfacLogModule,
  ],
  controllers: [MfgDrawingController],
  providers: [
    MfgDrawingService,
    MfgDrawingRepository,
    MfgDrawingCreateChecksheetService,
  ],
  exports: [MfgDrawingService, MfgDrawingCreateChecksheetService],
})
export class MfgDrawingModule {}
