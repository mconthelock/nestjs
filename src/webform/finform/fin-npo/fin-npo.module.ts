import { Module } from '@nestjs/common';
import { FinnpoService } from './fin-npo.service';
import { FinnpoController } from './fin-npo.controller';
import { FinnpoRepository } from './fin-npo.repository';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormModule } from 'src/webform/form/form.module';
import { FlowModule } from 'src/webform/flow/flow.module';

import { FINNPOFORM } from 'src/common/Entities/webform/table/FINNPO_FORM.entity';
import { FINNPOINVOICE } from 'src/common/Entities/webform/table/FINNPO_INVOICE.entity';
import { FINNPOVENDOR } from 'src/common/Entities/webform/table/FINNPO_VENDOR.entity';
import { FINNPOEXPENSE } from 'src/common/Entities/webform/table/FINNPO_EXPENSE.entity';
import { FINNPOCOSTCENTER } from 'src/common/Entities/webform/table/FINNPO_COSTCENTER.entity';
import { FINNPOCURRENCY } from 'src/common/Entities/webform/table/FINNPO_Currency.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';


import {DSDUTYSTAMP } from  'src/common/Entities/webform/table/FINDS_DUTY_STAMP.entity'
import {DSREQDETAIL } from  'src/common/Entities/webform/table/FINDS_REQ_DETAIL.entity'
import {DSSTOCK } from  'src/common/Entities/webform/table/FINDS_STOCK.entity'
import {DSREQHEAD } from  'src/common/Entities/webform/table/FINDS_REQ_HEAD.entity'
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { HandleFileFormModule } from "src/webform/handle-file-form/handle-file-form.module";
import { UsersModule } from 'src/amec/users/users.module';


@Module({
  imports:[
      TypeOrmModule.forFeature(
          [
              FORM,
              FINNPOFORM,
              FINNPOINVOICE,
              FINNPOEXPENSE,
              FINNPOVENDOR,
              FINNPOCOSTCENTER,
              FINNPOCURRENCY,
          ],
          'webformConnection',
      ),
      FormModule,
      FlowModule,
      FormmstModule,HandleFileFormModule,UsersModule
  ],

  controllers: [FinnpoController],
  providers: [FinnpoService,FinnpoRepository],

})
export class FinNpoModule {}
