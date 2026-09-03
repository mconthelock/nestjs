import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RNLIST_PP } from 'src/common/Entities/webform/table/RNLIST_PP.entity';

import { RnlistPpController } from './rnlist_pp.controller';
import { RnlistPpRepository } from './rnlist_pp.repository';
import { RnlistPpService } from './rnlist_pp.service';

@Module({
  imports: [TypeOrmModule.forFeature([RNLIST_PP], 'webformConnection')],
  controllers: [RnlistPpController],
  providers: [RnlistPpService, RnlistPpRepository],
  exports: [RnlistPpService],
})
export class RnlistPpModule {}