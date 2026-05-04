import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MfgEdrService } from './mfg-edr.service';
import { MfgEdrController } from './mfg-edr.controller';

import { EdrWorktypeMst } from '../../../common/Entities/webform/table/edr_worktype_mst.entity';
import { EdrCauseMst } from '../../../common/Entities/webform/table/edr_cause_mst.entity';
import { EdrLineMst } from '../../../common/Entities/webform/table/edr_line_mst.entity';
import { EdrProcessMst } from '../../../common/Entities/webform/table/edr_process_mst.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EdrWorktypeMst,
      EdrLineMst,
      EdrProcessMst,
      EdrCauseMst,
    ], 'webformConnection'),
  ],
  controllers: [MfgEdrController],
  providers: [MfgEdrService],
})
export class MfgEdrModule {}