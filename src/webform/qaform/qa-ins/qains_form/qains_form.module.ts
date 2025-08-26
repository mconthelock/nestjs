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

@Module({
  imports: [
    TypeOrmModule.forFeature([QainsForm, Form], 'amecConnection'),
    FormModule,
    FlowModule,
    QainsOAModule,
    QaFileModule,
    SequenceOrgModule,
    UsersModule
  ],
  controllers: [QainsFormController],
  providers: [QainsFormService],
})
export class QainsFormModule {}
