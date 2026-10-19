import { forwardRef, Module } from '@nestjs/common';
import { PurPraService } from './services/pur-pra.service';
import { PurPraController } from './controller/pur-pra.controller';
import { CommitteeRepository } from './repository/committe.repository';
import { GroupRepository } from './repository/group.repository';
import { ReasonsMasterRepository } from './repository/reasons-master.repository';
import { PurPraCreateService } from './services/pur-pra-create-form.service';
import { HandleFileFormModule } from 'src/webform/handle-file-form/handle-file-form.module';
import { ReasonRepository } from './repository/reason.repository';
import { FormRepository } from './repository/form.repository';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { FormLinkModule } from 'src/webform/form-link/form-link.module';
import { PurCpcModule } from '../pur-cpc/pur-cpc.module';
import { FlowModule } from 'src/webform/flow/flow.module';

@Module({
    imports: [
        HandleFileFormModule,
        FormModule,
        FormmstModule,
        FormLinkModule,
        FlowModule,
        forwardRef(() => PurCpcModule),
    ],
    controllers: [PurPraController],
    providers: [
        //service
        PurPraService,
        PurPraCreateService,
        //repository
        CommitteeRepository,
        GroupRepository,
        FormRepository,
        ReasonRepository,
        ReasonsMasterRepository,
    ],
    exports: [
        PurPraService,
        PurPraCreateService,
    ]
})
export class PurPraModule {}
