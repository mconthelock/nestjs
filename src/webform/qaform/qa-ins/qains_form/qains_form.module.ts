import { Module } from '@nestjs/common';
import { QainsFormService } from './qains_form.service';
import { QainsFormController } from './qains_form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormModule } from 'src/webform/form/form.module';
import { QainsOAModule } from '../qains_operator_auditor/qains_operator_auditor.module';
import { QaFileModule } from '../../qa_file/qa_file.module';

import { FlowModule } from 'src/webform/flow/flow.module';
import { SequenceOrgModule } from 'src/webform/sequence-org/sequence-org.module';
import { OrgposModule } from 'src/webform/orgpos/orgpos.module';
import { UsersModule } from 'src/escs/user/user.module';
import { UserItemModule } from 'src/escs/user-item/user-item.module';
import { ItemStationModule } from 'src/escs/item-station/item-station.module';
import { UsersItemStationModule } from 'src/escs/user-item-station/user-item-station.module';
import { UsersFileModule } from 'src/escs/user-file/user-file.module';
import { UsersAuthorizeModule } from 'src/escs/user-authorize/user-authorize.module';
import { UsersSectionModule } from 'src/escs/user_section/user_section.module';
import { MailModule } from 'src/common/services/mail/mail.module';
import { PDFModule } from 'src/common/services/pdf/pdf.module';
import { QainsFormRepository } from './qains_form.repository';
import { AmecUserAllModule } from 'src/amec/amecuserall/amecuserall.module';
import { QAINS_FORM } from 'src/common/Entities/webform/table/QAINS_FORM.entity';
import { QainsFormCreateService } from './qains_form-create.service';
import { QainsFormLastApproveService } from './qains_form-last-approve.service';
import { QainsFormQcConfirmService } from './qains_form-qcConfirm.service';
import { QainsFormReturnService } from './qains_form-return.service';
import { QainsFormSetInchargeService } from './qains_form-setIncharge.sevice';

@Module({
    imports: [
        TypeOrmModule.forFeature([QAINS_FORM], 'webformConnection'),
        FormModule,
        FlowModule,
        QainsOAModule,
        QaFileModule,
        SequenceOrgModule,
        UsersModule,
        MailModule,
        OrgposModule,
        AmecUserAllModule,
        UserItemModule,
        ItemStationModule,
        UsersItemStationModule,
        PDFModule,
        UsersFileModule,
        UsersAuthorizeModule,
        UsersSectionModule,
    ],
    controllers: [QainsFormController],
    providers: [
        QainsFormService,
        QainsFormCreateService,
        QainsFormLastApproveService,
        QainsFormQcConfirmService,
        QainsFormReturnService,
        QainsFormSetInchargeService,
        QainsFormRepository,
    ],
})
export class QainsFormModule {}
