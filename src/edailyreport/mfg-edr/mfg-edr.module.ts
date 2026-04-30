import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MfgEdrService } from './mfg-edr.service';
import { MfgEdrController } from './mfg-edr.controller';

import { EdrWorktypeMst } from '../../common/Entities/edailyreport/table/edr_worktype_mst.entity';
import { EdrCauseMst } from '../../common/Entities/edailyreport/table/edr_cause_mst.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EdrWorktypeMst,
      EdrCauseMst,
    ]),
  ],
  controllers: [MfgEdrController],
  providers: [MfgEdrService],
})
export class MfgEdrModule {}