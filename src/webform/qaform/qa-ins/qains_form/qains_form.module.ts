import { Module } from '@nestjs/common';
import { QainsFormService } from './qains_form.service';
import { QainsFormController } from './qains_form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QainsForm } from '../qains_form/entities/qains_form.entity';
import { Form } from 'src/webform/form/entities/form.entity';

import { FormModule } from 'src/webform/form/form.module';
import { QainsOAModule } from '../qains_operator_auditor/qains_operator_auditor.module';
import { QaFileModule } from '../../qa_file/qa_file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QainsForm, Form], 'amecConnection'),
    FormModule,
    QainsOAModule,
    QaFileModule
  ],
  controllers: [QainsFormController],
  providers: [QainsFormService],
})
export class QainsFormModule {}
