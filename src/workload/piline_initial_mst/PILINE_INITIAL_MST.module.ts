import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PILINE_INITIAL_MST } from 'src/common/Entities/workload/table/PILINE_INITIAL_MST.entity';
import { PilineInitialMstController } from './PILINE_INITIAL_MST.controller';
import { PilineInitialMstService } from './PILINE_INITIAL_MST.service';
import { PilineInitialMstRepository } from './PILINE_INITIAL_MST.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([PILINE_INITIAL_MST], 'workloadConnection'),
    ],
    controllers: [PilineInitialMstController],
    providers: [PilineInitialMstService, PilineInitialMstRepository],
    exports: [PilineInitialMstService],
})
export class PilineInitialMstModule {}
