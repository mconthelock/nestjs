import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PILINE_MAPPING_MST } from 'src/common/Entities/workload/table/PILINE_MAPPING_MST.entity';
import { PilineMappingMstController } from './PILINE_MAPPING_MST.controller';
import { PilineMappingMstService } from './PILINE_MAPPING_MST.service';
import { PilineMappingMstRepository } from './PILINE_MAPPING_MST.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([PILINE_MAPPING_MST], 'workloadConnection'),
    ],
    controllers: [PilineMappingMstController],
    providers: [PilineMappingMstService, PilineMappingMstRepository],
    exports: [PilineMappingMstService],
})
export class PilineMappingMstModule {}
