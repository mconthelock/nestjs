import { Module } from '@nestjs/common';
import { DpmsPlIssueService } from './dpms_pl_issue.service';
import { DpmsPlIssueController } from './dpms_pl_issue.controller';
import { DpmsPlIssueRepository } from './dpms_pl_issue.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PL_ISSUE } from 'src/common/Entities/workload/table/DPMS_PL_ISSUE.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DPMS_PL_ISSUE], 'workloadConnection')],
    controllers: [DpmsPlIssueController],
    providers: [DpmsPlIssueService, DpmsPlIssueRepository],
    exports: [DpmsPlIssueService],
})
export class DpmsPlIssueModule {}
