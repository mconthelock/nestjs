import { Module } from '@nestjs/common';
import { PackingListIssueService } from './packing-list-issue.service';
import { MainController } from './controller/main.controller';
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
    ProcedureDataCenterRepository,
    ProcedureWorkloadRepository,
} from './packing-list-issue.repository';
import { ProcedureService } from './services/procedure.service';
import { DpmsPlMailModule } from 'src/workload/dpms_pl_mail/dpms_pl_mail.module';
import { DpmsPlDocRevModule } from 'src/workload/dpms_pl_doc_rev/dpms_pl_doc_rev.module';
import { ExcelService } from './services/excel.service';
import { JobController } from './controller/job.controller';
import { MarReportService } from './services/mar-report.service';
import { ReviseVgmService } from './services/revise-vgm.service';
import { DpmsPlWeightChangeModule } from 'src/workload/dpms_pl_weight_change/dpms_pl_weight_change.module';
import { GenPdfService } from './services/pdf.service';
import { IssueService } from './services/issue.service';
import { HtmlService } from './services/html.service';
import { PackingListCreateService } from './packing-list-create.service';

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
        DpmsPlWeightChangeModule,
        MailModule,
    ],
    controllers: [MainController, JobController],
    providers: [
        PackingListIssueService,
        ProcedureWorkloadRepository,
        ProcedureDataCenterRepository,
        ProcedureService,
        PackingListCreateService,
        IssueService,
        HtmlService,
        ExcelService,
        GenPdfService,
        MarReportService,
        ReviseVgmService,
    ],
    exports: [PackingListIssueService, ProcedureService],
})
export class PackingListIssueModule {}
