import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MfgEdrService } from './mfg-edr.service';
import { MfgEdrController } from './mfg-edr.controller';

import { EdrWorktypeMst } from '../../../common/Entities/webform/table/edr_worktype_mst.entity';
import { EdrCauseMst } from '../../../common/Entities/webform/table/edr_cause_mst.entity';
import { EdrLineMst } from '../../../common/Entities/webform/table/edr_line_mst.entity';
import { EdrProcessMst } from '../../../common/Entities/webform/table/edr_process_mst.entity';

import { MfgEdrFormHead } from '../../../common/Entities/webform/table/mfg_edr_form_head.entity';
import { MfgEdrFormList } from '../../../common/Entities/webform/table/mfg_edr_form_list.entity';
import { MfgEdrFormAtt } from '../../../common/Entities/webform/table/mfg_edr_form_att.entity';
import { MfgEdrFormCorrective } from '../../../common/Entities/webform/table/mfg_edr_form_corrective.entity';
import { MfgEdrFormPreventive } from '../../../common/Entities/webform/table/mfg_edr_form_preventive.entity';
import { MfgEdrFormWhy } from '../../../common/Entities/webform/table/mfg_edr_form_why.entity';

import { AmecOrders } from 'src/common/Entities/workload/table/amecorders.entity';
import { AmecOrdersSchedule } from 'src/common/Entities/workload/table/amecorders_schedule.entity';
import { FORM } from '../../../common/Entities/webform/table/FORM.entity';
import { FLOW } from '../../../common/Entities/webform/table/FLOW.entity';
import { AMECUSERALL } from '../../../common/Entities/amec/views/AMECUSERALL.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EdrWorktypeMst,
      EdrLineMst,
      EdrProcessMst,
      EdrCauseMst,
      AmecOrders,
      AmecOrdersSchedule,
      MfgEdrFormHead,
      MfgEdrFormList,
      MfgEdrFormAtt,
      MfgEdrFormCorrective,
      MfgEdrFormPreventive,
      MfgEdrFormWhy,
      FORM,
      FLOW,
      AMECUSERALL,
    ], 'webformConnection'),
  ],
  controllers: [MfgEdrController],
  providers: [MfgEdrService],
})
export class MfgEdrModule {}