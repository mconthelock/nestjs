import { Module } from '@nestjs/common';
import { PurNvfRequestService } from './pur-nvf-request.service';
import { PurNvfController } from './pur-nvf-controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PURNVF_FORM } from 'src/common/Entities/webform/table/PURVNF_FORM.entity';
import { FormModule } from 'src/webform/form/form.module';
import { PurFileModule } from '../pur-file/pur-file.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { RepModule } from 'src/webform/rep/rep.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { FlowmstModule } from 'src/webform/flowmst/flowmst.module';

import { PurnvfFormRepository } from './purnvf_form/purnvf_form.repository';
import { PurnvfListRepository } from './purnvf_list/purnvf_list.repository';
import { PurnvfAddressRepository } from './purnvf_address/purnvf_address.repository';
import { UsersModule } from 'src/amec/users/users.module';
import { PappflowModule } from 'src/amec/pappflow/pappflow.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PURNVF_FORM], 'webformConnection'),
        FormmstModule,
        FormModule,
        FlowModule,
        FlowmstModule,
        PurFileModule,
        RepModule,
        UsersModule,
        PappflowModule
    ],
    controllers: [PurNvfController],
    providers: [
        PurNvfRequestService,
        PurnvfFormRepository,
        PurnvfListRepository,
        PurnvfAddressRepository
    ],
    exports: [PurNvfRequestService],
})
export class PurNvfModule {}
