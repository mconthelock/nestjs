import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RNLIST } from 'src/common/Entities/webform/table/RNLIST.entity';

import { RnlistController } from './rnlist.controller';
import { RnlistRepository } from './rnlist.repository';
import { RnlistService } from './rnlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([RNLIST], 'webformConnection')],
  controllers: [RnlistController],
  providers: [RnlistService, RnlistRepository],
  exports: [RnlistService],
})
export class RnlistModule {}