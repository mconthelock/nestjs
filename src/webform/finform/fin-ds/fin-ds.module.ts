import { Module } from '@nestjs/common';
import { FinDsService } from './fin-ds.service';
import { FinDsController } from './fin-ds.controller';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormModule } from 'src/webform/center/form/form.module';
import { FlowModule } from 'src/webform/center/flow/flow.module';

import { DSDUTYSTAMP } from 'src/common/Entities/webform/table/FINDS_DUTY_STAMP.entity';
import { DSREQDETAIL } from 'src/common/Entities/webform/table/FINDS_REQ_DETAIL.entity';
import { DSSTOCK } from 'src/common/Entities/webform/table/FINDS_STOCK.entity';
import { DSREQHEAD } from 'src/common/Entities/webform/table/FINDS_REQ_HEAD.entity';
import { FinDsRepository } from './fin-ds.repository';
import { FormmstModule } from 'src/webform/center/formmst/formmst.module';
import { HandleFileFormModule } from 'src/webform/center/handle-file-form/handle-file-form.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([DSDUTYSTAMP], 'webformConnection'),
        FormModule,
        FlowModule,
        FormmstModule,
        HandleFileFormModule,
    ],

    controllers: [FinDsController],
    providers: [FinDsService, FinDsRepository],
})
export class FinDsModule {}
