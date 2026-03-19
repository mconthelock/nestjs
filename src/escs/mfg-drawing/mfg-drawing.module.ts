import { Module } from '@nestjs/common';
import { MfgDrawingService } from './mfg-drawing.service';
import { MfgDrawingController } from './mfg-drawing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MFG_DRAWING } from 'src/common/Entities/escs/table/MFG_DRAWING.entity';
import { MfgDrawingRepository } from './mfg-drawing.repository';
import { MfgDrawingCreateChecksheetService } from './mfg-drawing-checksheet.service';
import { ItemMfgModule } from '../item-mfg/item-mfg.module';
import { IdtagEfacLogModule } from 'src/workload/idtag-efac-log/idtag-efac-log.module';
import { S011mpModule } from 'src/datacenter/s011mp/s011mp.module';
import { F110kpModule } from 'src/datacenter/f110kp/f110kp.module';
import { FilesModule } from 'src/common/services/file/file.module';
import { MfgSerialModule } from '../mfg-serial/mfg-serial.module';
import { MfgDrawingActionModule } from '../mfg-drawing-action/mfg-drawing-action.module';
import { F001kpModule } from 'src/datacenter/f001kp/f001kp.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([MFG_DRAWING], 'escsConnection'),
        ItemMfgModule,
        IdtagEfacLogModule,
        F110kpModule,
        F001kpModule,
        S011mpModule,
        FilesModule,
        MfgSerialModule,
        MfgDrawingActionModule,
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
