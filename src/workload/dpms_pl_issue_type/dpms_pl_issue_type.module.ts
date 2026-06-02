import { Module } from '@nestjs/common';
import { DpmsPlIssueTypeService } from './dpms_pl_issue_type.service';
import { DpmsPlIssueTypeController } from './dpms_pl_issue_type.controller';
import { DpmsPlIssueTypeRepository } from './dpms_pl_issue_type.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PL_ISSUE_TYPE } from 'src/common/Entities/workload/table/DPMS_PL_ISSUE_TYPE.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([DPMS_PL_ISSUE_TYPE], 'workloadConnection'),
    ],
    controllers: [DpmsPlIssueTypeController],
    providers: [DpmsPlIssueTypeService, DpmsPlIssueTypeRepository],
    exports: [DpmsPlIssueTypeService],
})
export class DpmsPlIssueTypeModule {}
