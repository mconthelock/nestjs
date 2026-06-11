import { Module } from '@nestjs/common';
import { DpmsPlIssueDateService } from './dpms_pl_issue_date.service';
import { DpmsPlIssueDateController } from './dpms_pl_issue_date.controller';
import { DpmsPlIssueDateRepository } from './dpms_pl_issue_date.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PL_ISSUE_DATE } from 'src/common/Entities/workload/views/DPMS_PL_ISSUE_DATE.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([DPMS_PL_ISSUE_DATE], 'workloadConnection'),
    ],
    controllers: [DpmsPlIssueDateController],
    providers: [DpmsPlIssueDateService, DpmsPlIssueDateRepository],
    exports: [DpmsPlIssueDateService],
})
export class DpmsPlIssueDateModule {}
