import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PILINE_SECTION_MST } from 'src/common/Entities/workload/table/PILINE_SECTION_MST.entity';
import { PilineSectionMstController } from './PILINE_SECTION_MST.controller';
import { PilineSectionMstService } from './PILINE_SECTION_MST.service';
import { PilineSectionMstRepository } from './PILINE_SECTION_MST.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([PILINE_SECTION_MST], 'workloadConnection'),
    ],
    controllers: [PilineSectionMstController],
    providers: [PilineSectionMstService, PilineSectionMstRepository],
    exports: [PilineSectionMstService],
})
export class PilineSectionMstModule {}
