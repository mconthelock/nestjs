import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RNWASTE } from 'src/common/Entities/webform/table/RNWASTE.entity';

import { RnwasteController } from './rnwaste.controller';
import { RnwasteRepository } from './rnwaste.repository';
import { RnwasteService } from './rnwaste.service';

@Module({
  imports: [TypeOrmModule.forFeature([RNWASTE], 'webformConnection')],
  controllers: [RnwasteController],
  providers: [RnwasteService, RnwasteRepository],
  exports: [RnwasteService],
})
export class RnwasteModule {}