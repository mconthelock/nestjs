import { Module } from '@nestjs/common';
import { PackingListIssueModule } from './packing-list-issue/packing-list-issue.module';
import { SendVgmMeltModule } from './send-vgm-melt/send-vgm-melt.module';

@Module({
    imports: [PackingListIssueModule, SendVgmMeltModule],
})
export class DpmsModule {}
