import { Module } from '@nestjs/common';
import { QainsFormService } from './qains_form.service';
import { QainsFormController } from './qains_form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QainsForm } from '../qains_form/entities/qains_form.entity';
import { Form } from 'src/webform/form/entities/form.entity';

import { FormModule } from 'src/webform/form/form.module';
import { QainsOAModule } from '../qains_operator_auditor/qains_operator_auditor.module';
import { QaFileModule } from '../../qa_file/qa_file.module';

import { FlowModule } from 'src/webform/flow/flow.module';
import { SequenceOrgModule } from 'src/webform/sequence-org/sequence-org.module';
import { UsersModule } from 'src/amec/users/users.module';
import { MailModule } from 'src/mail/mail.module';
import { OrgposModule } from 'src/webform/orgpos/orgpos.module';
import { ESCSUserModule } from 'src/escs/user/user.module';
import { ESCSUserItemModule } from 'src/escs/user-item/user-item.module';
import { ESCSItemStationModule } from 'src/escs/item-station/item-station.module';
import { ESCSUserItemStationModule } from 'src/escs/user-item-station/user-item-station.module';
import { PDFModule } from 'src/pdf/pdf.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QainsForm, Form], 'amecConnection'),
    FormModule,
    FlowModule,
    QainsOAModule,
    QaFileModule,
    SequenceOrgModule,
    UsersModule, 
    MailModule,
    OrgposModule,
    ESCSUserModule,
    ESCSUserItemModule,
    ESCSItemStationModule,
    ESCSUserItemStationModule,
    PDFModule
  ],
  controllers: [QainsFormController],
  providers: [QainsFormService],
})
export class QainsFormModule {}
