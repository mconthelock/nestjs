import { Module } from '@nestjs/common';
import { IdtagEfacLogModule } from './idtag-efac-log/idtag-efac-log.module';
import { DpmsPackingListModule } from './dpms_packing_list/dpms_packing_list.module';
import { DpmsPackingListMainModule } from './dpms_packing_list_main/dpms_packing_list_main.module';
import { DpmsPlIssueTypeModule } from './dpms_pl_issue_type/dpms_pl_issue_type.module';
import { DpmsPlIssueModule } from './dpms_pl_issue/dpms_pl_issue.module';
import { DpmsPlIssueRevModule } from './dpms_pl_issue_rev/dpms_pl_issue_rev.module';
import { DpmsPlFileModule } from './dpms_pl_file/dpms_pl_file.module';
import { DpmsPlCaseListModule } from './dpms_pl_case_list/dpms_pl_case_list.module';
import { DpmsPlCaseListDetailModule } from './dpms_pl_case_list_detail/dpms_pl_case_list_detail.module';
import { DpmsPlIssueDateModule } from './dpms_pl_issue_date/dpms_pl_issue_date.module';
import { AmecordersScheduleModule } from './amecorders_schedule/amecorders_schedule.module';
import { VpsModule } from './vps/vps.module';

@Module({
    imports: [
        IdtagEfacLogModule,
        DpmsPackingListModule,
        DpmsPackingListMainModule,
        DpmsPlIssueTypeModule,
        DpmsPlIssueModule,
        DpmsPlIssueRevModule,
        DpmsPlFileModule,
        DpmsPlCaseListModule,
        DpmsPlCaseListDetailModule,
        DpmsPlIssueDateModule,
        AmecordersScheduleModule,
        VpsModule,
    ],
})
export class WorkloadModule {}
