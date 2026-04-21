import { Module } from '@nestjs/common';
import { PurCpmService } from './pur-cpm.service';
import { PurCpmController } from './pur-cpm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PURCPM_FORM } from 'src/common/Entities/webform/table/PURCPM_FORM.entity';
import { FormModule } from 'src/webform/form/form.module';
import { PurFileModule } from '../pur-file/pur-file.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { RepModule } from 'src/webform/rep/rep.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { PurCpmRepository } from './pur-cpm.repository';
import { PurCpmRequestService } from './pur-cpm-request.service';
import { PurCpmReturnAprroveService } from './pur-cpm-return-aprrove.service';
import { FlowmstModule } from 'src/webform/flowmst/flowmst.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PURCPM_FORM], 'webformConnection'),
        FormmstModule,
        FormModule,
        FlowModule,
        FlowmstModule,
        PurFileModule,
        RepModule,
    ],
    controllers: [PurCpmController],
    providers: [
        PurCpmService,
        PurCpmRequestService,
        PurCpmReturnAprroveService,
        PurCpmRepository,
    ],
    exports: [PurCpmService],
})
export class PurCpmModule {}
