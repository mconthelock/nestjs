import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VIEW_MFG_EDR_HEAD_ROOTCAUSE } from 'src/common/Entities/webform/views/VIEW_MFG_EDR_HEAD_ROOTCAUSE.entity';

import { RootcauseController } from './rootcause.controller';
import { RootcauseRepository } from './rootcause.repository';
import { RootcauseService } from './rootcause.service';


@Module({
  imports: [
    TypeOrmModule.forFeature(
      [VIEW_MFG_EDR_HEAD_ROOTCAUSE],
      'webformConnection',
    ),
  ],
  controllers: [RootcauseController],
  providers: [
    RootcauseService,
    RootcauseRepository,
  ],
  exports: [RootcauseService],
})
export class RootcauseModule {}