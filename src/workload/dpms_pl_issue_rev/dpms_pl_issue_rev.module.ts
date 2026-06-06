import { Module } from '@nestjs/common';
import { DpmsPlIssueRevService } from './dpms_pl_issue_rev.service';
import { DpmsPlIssueRevController } from './dpms_pl_issue_rev.controller';
import { DpmsPlIssueRevRepository } from './dpms_pl_issue_rev.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PL_ISSUE_REV } from 'src/common/Entities/workload/table/DPMS_PL_ISSUE_REV.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([DPMS_PL_ISSUE_REV], 'workloadConnection'),
    ],
    controllers: [DpmsPlIssueRevController],
    providers: [DpmsPlIssueRevService, DpmsPlIssueRevRepository],
    exports: [DpmsPlIssueRevService],
})
export class DpmsPlIssueRevModule {}
