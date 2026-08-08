import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProblemService } from './problem.service';
import { ProblemController } from './problem.controller';

import { Problemaster } from 'src/common/Entities/workload/table/DPMS_PROBLEM_MASTER.entity';
import { DpmsOrdersItem } from 'src/common/Entities/workload/table/DPMS_ORDERS_ITEM.entity';
import { AmecOrders } from 'src/common/Entities/workload/table/amecorders.entity';
import { DelayValues } from 'src/common/Entities/workload/table/DELAY_VALUES.entity';
import { SeriousProblems } from 'src/common/Entities/workload/table/serious_problems.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                Problemaster,
                DpmsOrdersItem,
                AmecOrders,
                DelayValues,
                SeriousProblems,
            ],
            'workloadConnection',
        ),
    ],
    controllers: [ProblemController],
    providers: [ProblemService],
})
export class ProblemModule {}
