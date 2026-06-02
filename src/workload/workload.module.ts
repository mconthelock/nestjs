import { Module } from '@nestjs/common';
import { IdtagEfacLogModule } from './idtag-efac-log/idtag-efac-log.module';
import { DpmsPackingListModule } from './dpms_packing_list/dpms_packing_list.module';
import { DpmsPackingListMainModule } from './dpms_packing_list_main/dpms_packing_list_main.module';
import { DpmsPlIssueTypeModule } from './dpms_pl_issue_type/dpms_pl_issue_type.module';

@Module({
    imports: [
        IdtagEfacLogModule,
        DpmsPackingListModule,
        DpmsPackingListMainModule,
        DpmsPlIssueTypeModule,
    ],
})
export class WorkloadModule {}
