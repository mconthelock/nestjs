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

@Module({
    imports: [
        DpmsPlIssueModule,
        PDFModule,
        DpmsPlIssueRevModule,
        DpmsPlFileModule,
        DpmsPlCaseListModule,
        DpmsPlCaseListDetailModule,
        DpmsPlIssueTypeModule,
        MailModule,
    ],
    controllers: [PackingListIssueController],
    providers: [PackingListIssueService],
    exports: [PackingListIssueService],
})
export class PackingListIssueModule {}
