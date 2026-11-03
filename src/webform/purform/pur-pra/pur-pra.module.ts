import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
import { KeyLinkRepository } from './repository/keyLink.repository';
import { PURPRA_FORM } from 'src/common/Entities/webform/table/PURPRA_FORM.entity';
import { PURPRA_COMMITTEE } from 'src/common/Entities/webform/table/PURPRA_COMMITTEE.entity';
import { PURPRA_GROUP } from 'src/common/Entities/webform/table/PURPRA_GROUP.entity';
import { PURPRA_REASONS } from 'src/common/Entities/webform/table/PURPRA_REASONS.entity';
import { PURPRA_REASON_MASTER } from 'src/common/Entities/webform/table/PURPRA_REASON_MASTER.entity';
import { PURPRA_LINK_KEY_VIEW } from 'src/common/Entities/webform/views/PURPRA_LINK_KEY_VIEW.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                PURPRA_FORM,
                PURPRA_COMMITTEE,
                PURPRA_GROUP,
                PURPRA_REASONS,
                PURPRA_REASON_MASTER,
                PURPRA_LINK_KEY_VIEW,
            ],
            'mitsuConnection',
        ),
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
        KeyLinkRepository,
    ],
    exports: [PurPraService, PurPraCreateService],
})
export class PurPraModule {}
