import { Module } from '@nestjs/common';
import { PackingListIssueService } from './packing-list-issue.service';
import { PackingListIssueController } from './packing-list-issue.controller';
import { DpmsPlIssueModule } from 'src/workload/dpms_pl_issue/dpms_pl_issue.module';
import { PDFModule } from 'src/common/services/pdf/pdf.module';
import { DpmsPlIssueRevModule } from 'src/workload/dpms_pl_issue_rev/dpms_pl_issue_rev.module';
import { DpmsPlFileModule } from 'src/workload/dpms_pl_file/dpms_pl_file.module';
import { DpmsPlCaseListModule } from 'src/workload/dpms_pl_case_list/dpms_pl_case_list.module';
import { DpmsPlCaseListDetailModule } from 'src/workload/dpms_pl_case_list_detail/dpms_pl_case_list_detail.module';
import { MailModule } from 'src/common/services/mail/mail.module';
import { DpmsPlIssueTypeModule } from 'src/workload/dpms_pl_issue_type/dpms_pl_issue_type.module';
import { DpmsPlIssueDateModule } from 'src/workload/dpms_pl_issue_date/dpms_pl_issue_date.module';
import {
    PackinglistIssueProcedureDataCenterRepository,
    PackingListIssueProcedureWorkloadRepository,
} from './packing-list-issue.repository';
import { PackingListIssueProcedureService } from './packing-list-issue-procedure.service';
import { DpmsPlMailModule } from 'src/workload/dpms_pl_mail/dpms_pl_mail.module';
import { DpmsPlDocRevModule } from 'src/workload/dpms_pl_doc_rev/dpms_pl_doc_rev.module';
import { PackingListCreateService } from './packing-list-create.service';
import { PackingListReviseService } from './packing-list-revise.service';

@Module({
    imports: [
        DpmsPlIssueModule,
        PDFModule,
        DpmsPlIssueRevModule,
        DpmsPlFileModule,
        DpmsPlCaseListModule,
        DpmsPlCaseListDetailModule,
        DpmsPlIssueTypeModule,
        DpmsPlIssueDateModule,
        DpmsPlMailModule,
        DpmsPlDocRevModule,
        MailModule,
    ],
    controllers: [PackingListIssueController],
    providers: [
        PackingListIssueService,
        PackingListIssueProcedureWorkloadRepository,
        PackinglistIssueProcedureDataCenterRepository,
        PackingListIssueProcedureService,
        PackingListCreateService,
        PackingListReviseService,
    ],
    exports: [PackingListIssueService, PackingListIssueProcedureService],
})
export class PackingListIssueModule {}
