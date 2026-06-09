import { Module } from '@nestjs/common';
import { DpmsPlCaseListService } from './dpms_pl_case_list.service';
import { DpmsPlCaseListController } from './dpms_pl_case_list.controller';
import { DpmsPlCaseListRepository } from './dpms_pl_case_list.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PL_CASE_LIST } from 'src/common/Entities/workload/table/DPMS_PL_CASE_LIST.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([DPMS_PL_CASE_LIST], 'workloadConnection'),
    ],
    controllers: [DpmsPlCaseListController],
    providers: [DpmsPlCaseListService, DpmsPlCaseListRepository],
    exports: [DpmsPlCaseListService],
})
export class DpmsPlCaseListModule {}
