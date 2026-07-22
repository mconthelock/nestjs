import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RNFRM_PART } from 'src/common/Entities/webform/table/RNFRM_PART.entity';
import { RnfrmPartController } from './rnfrm_part.controller';
import { RnfrmPartRepository } from './rnfrm_part.repository';
import { RnfrmPartService } from './rnfrm_part.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RNFRM_PART], 'webformConnection'),
  ],
  controllers: [RnfrmPartController],
  providers: [RnfrmPartService, RnfrmPartRepository],
  exports: [RnfrmPartService],
})
export class RnfrmPartModule {}