import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PILINE_SECTION_MST } from 'src/common/Entities/workload/table/PILINE_SECTION_MST.entity';
import { Psection } from 'src/common/Entities/amec/table/PSECTION.entity';
import { PilineSectionMstController } from './PILINE_SECTION_MST.controller';
import { PilineSectionMstService } from './PILINE_SECTION_MST.service';
import { PilineSectionMstRepository } from './PILINE_SECTION_MST.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([PILINE_SECTION_MST], 'mitsuConnection'),
        TypeOrmModule.forFeature([Psection], 'datacenterConnection'),
    ],
    controllers: [PilineSectionMstController],
    providers: [PilineSectionMstService, PilineSectionMstRepository],
    exports: [PilineSectionMstService],
})
export class PilineSectionMstModule {}
