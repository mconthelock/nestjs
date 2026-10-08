import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { piline_bending_att } from 'src/common/Entities/workload/table/piline_bending_att.entity';

import { PilineBendingAttController } from './piline_bending_att.controller';
import { PilineBendingAttRepository } from './piline_bending_att.repository';
import { PilineBendingAttService } from './piline_bending_att.service';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [piline_bending_att],
      'workloadConnection',
    ),
  ],
  controllers: [PilineBendingAttController],
  providers: [
    PilineBendingAttService,
    PilineBendingAttRepository,
  ],
  exports: [PilineBendingAttService],
})
export class PilineBendingAttModule {}