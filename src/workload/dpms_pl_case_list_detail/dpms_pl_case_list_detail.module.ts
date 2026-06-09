import { Module } from '@nestjs/common';
import { DpmsPlCaseListDetailService } from './dpms_pl_case_list_detail.service';
import { DpmsPlCaseListDetailController } from './dpms_pl_case_list_detail.controller';
import { DpmsPlCaseListDetailRepository } from './dpms_pl_case_list_detail.repository';
import { DPMS_PL_CASE_LIST_DETAIL } from 'src/common/Entities/workload/table/DPMS_PL_CASE_LIST_DETAIL.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [DPMS_PL_CASE_LIST_DETAIL],
            'workloadConnection',
        ),
    ],
    controllers: [DpmsPlCaseListDetailController],
    providers: [DpmsPlCaseListDetailService, DpmsPlCaseListDetailRepository],
    exports: [DpmsPlCaseListDetailService],
})
export class DpmsPlCaseListDetailModule {}
