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
import { DpmsPlMailModule } from './dpms_pl_mail/dpms_pl_mail.module';
import { VpsModule } from './vps/vps.module';
import { KanbanRequestModule } from './kanban_request/kanban_request.module';
import { DpmsPlLastRevisionViewModule } from './dpms_pl_last_revision_view/dpms_pl_last_revision_view.module';
import { DpmsPlDocRevModule } from './dpms_pl_doc_rev/dpms_pl_doc_rev.module';
import { DpmsPlMeltLogModule } from './dpms_pl_melt_log/dpms_pl_melt_log.module';
import { DpmsPlWeightChangeModule } from './dpms_pl_weight_change/dpms_pl_weight_change.module';
import { CountryOriginModule } from './country_origin/country_origin.module';
import { DpmsPlOriginModule } from './dpms_pl_origin/dpms_pl_origin.module';
import { OriginMasterMarViewModule } from './origin_master_mar_view/origin_master_mar_view.module';
import { MaterialStatusInquiryViewModule } from './material_status_inquiry_view/material_status_inquiry_view.module';

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
        DpmsPlMailModule,
        VpsModule,
        KanbanRequestModule,
        DpmsPlLastRevisionViewModule,
        DpmsPlDocRevModule,
        DpmsPlMeltLogModule,
        DpmsPlWeightChangeModule,
        CountryOriginModule,
        DpmsPlOriginModule,
        OriginMasterMarViewModule,
        MaterialStatusInquiryViewModule,
    ],
})
export class WorkloadModule {}
