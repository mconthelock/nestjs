import { Module } from '@nestjs/common';
import { PurnvfFormService } from './purnvf_form.service';
import { PurnvfFormController } from './purnvf_form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PURNVF_FORM } from 'src/common/Entities/webform/table/PURVNF_FORM.entity';
import { PurnvfFormRepository } from './purnvf_form.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PURNVF_FORM], 'webformConnection')],
  controllers: [PurnvfFormController],
  providers: [PurnvfFormService, PurnvfFormRepository],
  exports: [PurnvfFormService],
})
export class PurnvfFormModule {}
