import { Module } from '@nestjs/common';
import { PackingListIssueModule } from './packing-list-issue/packing-list-issue.module';

@Module({
    imports: [PackingListIssueModule],
})
export class DpmsModule {}
