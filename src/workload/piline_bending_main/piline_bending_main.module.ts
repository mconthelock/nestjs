import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { piline_bending_main } from 'src/common/Entities/workload/table/piline_bending_main.entity';

import { PilineBendingMainController } from './piline_bending_main.controller';
import { PilineBendingMainRepository } from './piline_bending_main.repository';
import { PilineBendingMainService } from './piline_bending_main.service';


@Module({
  imports: [
    TypeOrmModule.forFeature(
      [piline_bending_main],
      'workloadConnection',
    ),
  ],
  controllers: [PilineBendingMainController],
  providers: [PilineBendingMainService, PilineBendingMainRepository,],
  exports: [PilineBendingMainService],
})
export class PilineBendingMainModule {}