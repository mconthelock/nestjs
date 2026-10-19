import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PILINE_CAUSE_MST } from 'src/common/Entities/workload/table/PILINE_CAUSE_MST.entity';
import { PilineCauseMstController } from './PILINE_CAUSE_MST.controller';
import { PilineCauseMstService } from './PILINE_CAUSE_MST.service';
import { PilineCauseMstRepository } from './PILINE_CAUSE_MST.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([PILINE_CAUSE_MST], 'workloadConnection'),
    ],
    controllers: [PilineCauseMstController],
    providers: [PilineCauseMstService, PilineCauseMstRepository],
    exports: [PilineCauseMstService],
})
export class PilineCauseMstModule {}
