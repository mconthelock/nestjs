import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WTYPE } from 'src/common/Entities/webform/table/WTYPE.entity';

import { WtypeController } from './wtype.controller';
import { WtypeRepository } from './wtype.repository';
import { WtypeService } from './wtype.service';

@Module({
  imports: [TypeOrmModule.forFeature([WTYPE], 'webformConnection')],
  controllers: [WtypeController],
  providers: [WtypeService, WtypeRepository],
  exports: [WtypeService],
})
export class WtypeModule {}