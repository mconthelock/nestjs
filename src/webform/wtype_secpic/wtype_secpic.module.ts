import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WTYPE_SECPIC } from 'src/common/Entities/webform/table/WTYPE_SECPIC.entity';

import { WtypeSecpicController } from './wtype_secpic.controller';
import { WtypeSecpicRepository } from './wtype_secpic.repository';
import { WtypeSecpicService } from './wtype_secpic.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WTYPE_SECPIC], 'webformConnection'),
  ],
  controllers: [WtypeSecpicController],
  providers: [WtypeSecpicService, WtypeSecpicRepository],
  exports: [WtypeSecpicService],
})
export class WtypeSecpicModule {}