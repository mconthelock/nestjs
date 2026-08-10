import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BlockmasterService } from './blockmaster.service';
import { BlockmasterController } from './blockmaster.controller';

import { BlockMaster } from '../../common/Entities/workload/table/APM_MASTER.entity';
// import { BlockStation } from '../../common/Entities/workload/table/APM_STATION.entity';

@Module({
    imports: [TypeOrmModule.forFeature([BlockMaster], 'workloadConnection')],
    controllers: [BlockmasterController],
    providers: [BlockmasterService],
})
export class BlockmasterModule {}
