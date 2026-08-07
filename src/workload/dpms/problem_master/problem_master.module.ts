import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProblemMasterService } from './problem_master.service';
import { ProblemMasterController } from './problem_master.controller';

import { Problemaster } from 'src/common/Entities/workload/table/DPMS_PROBLEM_MASTER.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Problemaster], 'workloadConnection')],
    controllers: [ProblemMasterController],
    providers: [ProblemMasterService],
})
export class ProblemMasterModule {}
