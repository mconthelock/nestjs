import { PilineCauseMstModule } from './piline_cause_mst/PILINE_CAUSE_MST.module';
import { PilineEventMstModule } from './piline_event_mst/PILINE_EVENT_MST.module';
import { PilineSectionMstModule } from './piline_section_mst/PILINE_SECTION_MST.module';
import { PilineProblemMstModule } from './piline_problem_mst/PILINE_PROBLEM_MST.module';
import { PilineMappingMstModule } from './piline_mapping_mst/PILINE_MAPPING_MST.module';
import { PilineLocationMstModule } from './piline_location_mst/PILINE_LOCATION_MST.module';
import { PilineInitialMstModule } from './piline_initial_mst/PILINE_INITIAL_MST.module';
import { PilineEventRecordModule } from './piline_event_record/PILINE_EVENT_RECORD.module';
import { PilineNgRecordModule } from './piline_ng_record/PILINE_NG_RECORD.module';
import { PilineAttModule } from './piline_att/PILINE_ATT.module';
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
import { LabelconfirmModule } from './labelconfirm/labelconfirm.module';
import { ShortageModule } from './shortage/shortage.module';
import { PilineBendingMainModule } from './piline_bending_main/piline_bending_main.module';
import { PilineBendingAttModule } from './piline_bending_att/piline_bending_att.module';
import { DpmsPlMeltLogModule } from './dpms_pl_melt_log/dpms_pl_melt_log.module';
import { DpmsPlWeightChangeModule } from './dpms_pl_weight_change/dpms_pl_weight_change.module';
import { CountryOriginModule } from './country_origin/country_origin.module';
import { DpmsPlOriginModule } from './dpms_pl_origin/dpms_pl_origin.module';
import { OriginMasterMarViewModule } from './origin_master_mar_view/origin_master_mar_view.module';
import { MaterialStatusInquiryViewModule } from './material_status_inquiry_view/material_status_inquiry_view.module';
import { CountryOriginBulkListViewModule } from './country_origin_bulk_list_view/country_origin_bulk_list_view.module';
import { BlockPackingModule } from './block_packing/block_packing.module';
import { CountryOriginCountryModule } from './country_origin_country/country_origin_country.module';
import { CountryOriginNotSetViewModule } from './country_origin_not_set_view/country_origin_not_set_view.module';
import { DpmsCountryConditionModule } from './dpms_country_condition/dpms_country_condition.module';
import { DpmsPackingListDetailModule } from './dpms_packing_list_detail/dpms_packing_list_detail.module';
import { StockPartFollowViewModule } from './stock_part_follow_view/stock_part_follow_view.module';
import { StockPartFollowModule } from './stock_part_follow/stock_part_follow.module';

@Module({
    imports: [
        PilineCauseMstModule,
        PilineEventMstModule,
        PilineSectionMstModule,
        PilineProblemMstModule,
        PilineMappingMstModule,
        PilineLocationMstModule,
        PilineInitialMstModule,
        PilineEventRecordModule,
        PilineNgRecordModule,
        PilineAttModule,
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
        LabelconfirmModule,
        ShortageModule,
        PilineBendingMainModule,
        PilineBendingAttModule,
        DpmsPlMeltLogModule,
        DpmsPlWeightChangeModule,
        CountryOriginModule,
        DpmsPlOriginModule,
        OriginMasterMarViewModule,
        MaterialStatusInquiryViewModule,
        CountryOriginBulkListViewModule,
        BlockPackingModule,
        CountryOriginCountryModule,
        CountryOriginNotSetViewModule,
        DpmsCountryConditionModule,
        DpmsPackingListDetailModule,
        StockPartFollowViewModule,
        StockPartFollowModule,
    ],
})
export class WorkloadModule {}
