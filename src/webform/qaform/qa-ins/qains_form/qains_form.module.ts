import { Module } from '@nestjs/common';
import { QainsFormService } from './qains_form.service';
import { QainsFormController } from './qains_form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QainsForm } from '../qains_form/entities/qains_form.entity';

import { FormModule } from 'src/webform/form/form.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([QainsForm], 'amecConnection'),
    FormModule
  ],
  controllers: [QainsFormController],
  providers: [QainsFormService],
})
export class QainsFormModule {}
