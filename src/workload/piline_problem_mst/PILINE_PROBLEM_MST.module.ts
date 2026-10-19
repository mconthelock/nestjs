import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PILINE_PROBLEM_MST } from 'src/common/Entities/workload/table/PILINE_PROBLEM_MST.entity';
import { PilineProblemMstController } from './PILINE_PROBLEM_MST.controller';
import { PilineProblemMstService } from './PILINE_PROBLEM_MST.service';
import { PilineProblemMstRepository } from './PILINE_PROBLEM_MST.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([PILINE_PROBLEM_MST], 'workloadConnection'),
    ],
    controllers: [PilineProblemMstController],
    providers: [PilineProblemMstService, PilineProblemMstRepository],
    exports: [PilineProblemMstService],
})
export class PilineProblemMstModule {}
