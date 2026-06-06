import { Module } from '@nestjs/common';
import { PackingListIssueService } from './packing-list-issue.service';
import { PackingListIssueController } from './packing-list-issue.controller';
import { DpmsPlIssueModule } from 'src/workload/dpms_pl_issue/dpms_pl_issue.module';
import { PDFModule } from 'src/common/services/pdf/pdf.module';

@Module({
    imports: [DpmsPlIssueModule, PDFModule],
    controllers: [PackingListIssueController],
    providers: [PackingListIssueService],
    exports: [PackingListIssueService],
})
export class PackingListIssueModule {}
