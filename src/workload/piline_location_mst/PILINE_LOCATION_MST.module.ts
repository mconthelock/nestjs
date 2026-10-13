import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PILINE_LOCATION_MST } from 'src/common/Entities/workload/table/PILINE_LOCATION_MST.entity';
import { PilineLocationMstController } from './PILINE_LOCATION_MST.controller';
import { PilineLocationMstService } from './PILINE_LOCATION_MST.service';
import { PilineLocationMstRepository } from './PILINE_LOCATION_MST.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([PILINE_LOCATION_MST], 'workloadConnection'),
    ],
    controllers: [PilineLocationMstController],
    providers: [PilineLocationMstService, PilineLocationMstRepository],
    exports: [PilineLocationMstService],
})
export class PilineLocationMstModule {}
