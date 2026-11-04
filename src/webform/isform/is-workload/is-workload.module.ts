import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsWorkloadService } from './is-workload.service';
import { IsWorkloadController } from './is-workload.controller';

import { IsWorkLoad } from 'src/common/Entities/docinv/table/allwork.entity';
import { IsWorkStatus } from 'src/common/Entities/docinv/table/workstatus.entity';

@Module({
    imports: [TypeOrmModule.forFeature([IsWorkLoad, IsWorkStatus], 'mitsuConnection')],
    controllers: [IsWorkloadController],
    providers: [IsWorkloadService],
})
export class IsWorkloadModule {}
