import { Module } from '@nestjs/common';
import { IdtagEfacLogModule } from './idtag-efac-log/idtag-efac-log.module';
import { DpmsPackingListModule } from './dpms_packing_list/dpms_packing_list.module';
import { DpmsPackingListMainModule } from './dpms_packing_list_main/dpms_packing_list_main.module';
import { DpmsPlIssueTypeModule } from './dpms_pl_issue_type/dpms_pl_issue_type.module';
import { DpmsPlIssueModule } from './dpms_pl_issue/dpms_pl_issue.module';
import { DpmsPlIssueRevModule } from './dpms_pl_issue_rev/dpms_pl_issue_rev.module';
import { DpmsPlFileModule } from './dpms_pl_file/dpms_pl_file.module';

@Module({
    imports: [
        IdtagEfacLogModule,
        DpmsPackingListModule,
        DpmsPackingListMainModule,
        DpmsPlIssueTypeModule,
        DpmsPlIssueModule,
        DpmsPlIssueRevModule,
        DpmsPlFileModule,
    ],
})
export class WorkloadModule {}
