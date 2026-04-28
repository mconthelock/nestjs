import { Module } from '@nestjs/common';
import { FinDsService } from './fin-ds.service';
import { FinDsController } from './fin-ds.controller';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormModule } from 'src/webform/form/form.module';
import { FlowModule } from 'src/webform/flow/flow.module';

import {DSDUTYSTAMP } from  'src/common/Entities/webform/table/FINDS_DUTY_STAMP.entity'
import {DSREQDETAIL } from  'src/common/Entities/webform/table/FINDS_REQ_DETAIL.entity'
import {DSSTOCK } from  'src/common/Entities/webform/table/FINDS_STOCK.entity'
import {DSREQHEAD } from  'src/common/Entities/webform/table/FINDS_REQ_HEAD.entity'

@Module({
  imports:[TypeOrmModule.forFeature([DSDUTYSTAMP,DSREQDETAIL,DSSTOCK,DSREQHEAD],'webformConnection'),
      FormModule,
      FlowModule,
  ],

  controllers: [FinDsController],
  providers: [FinDsService],

})
export class FinDsModule {}
