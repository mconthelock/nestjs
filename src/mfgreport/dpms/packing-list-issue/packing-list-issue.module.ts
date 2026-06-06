import { Module } from '@nestjs/common';
import { PackingListIssueService } from './packing-list-issue.service';
import { PackingListIssueController } from './packing-list-issue.controller';
import { DpmsPlIssueModule } from 'src/workload/dpms_pl_issue/dpms_pl_issue.module';
import { PDFModule } from 'src/common/services/pdf/pdf.module';
import { DpmsPlIssueRevModule } from 'src/workload/dpms_pl_issue_rev/dpms_pl_issue_rev.module';
import { DpmsPlFileModule } from 'src/workload/dpms_pl_file/dpms_pl_file.module';

@Module({
    imports: [
        DpmsPlIssueModule,
        PDFModule,
        DpmsPlIssueRevModule,
        DpmsPlFileModule,
    ],
    controllers: [PackingListIssueController],
    providers: [PackingListIssueService],
    exports: [PackingListIssueService],
})
export class PackingListIssueModule {}
