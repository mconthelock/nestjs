import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IsWorkloadService } from './is-workload.service';
import { IsWorkloadController } from './is-workload.controller';

import { IsWorkLoad } from './entities/allwork.entity';
import { IsWorkStatus } from './entities/workstatus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([IsWorkLoad, IsWorkStatus], 'docinvConnection'),
  ],
  controllers: [IsWorkloadController],
  providers: [IsWorkloadService],
})
export class IsWorkloadModule {}
