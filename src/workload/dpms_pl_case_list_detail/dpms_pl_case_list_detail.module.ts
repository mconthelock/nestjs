import { Module } from '@nestjs/common';
import { DpmsPlCaseListDetailService } from './dpms_pl_case_list_detail.service';
import { DpmsPlCaseListDetailController } from './dpms_pl_case_list_detail.controller';
import { DpmsPlCaseListDetailRepository } from './dpms_pl_case_list_detail.repository';
import { DPMS_PL_CASE_LIST_DETAIL } from 'src/common/Entities/workload/table/DPMS_PL_CASE_LIST_DETAIL.entity';
import { DPMS_PL_CASE_REVISE_VGM } from 'src/common/Entities/workload/views/DPMS_PL_CASE_REVISE_VGM.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [DPMS_PL_CASE_LIST_DETAIL, DPMS_PL_CASE_REVISE_VGM],
            'mitsuConnection',
        ),
    ],
    controllers: [DpmsPlCaseListDetailController],
    providers: [DpmsPlCaseListDetailService, DpmsPlCaseListDetailRepository],
    exports: [DpmsPlCaseListDetailService],
})
export class DpmsPlCaseListDetailModule {}
