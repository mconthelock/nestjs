import { Module } from '@nestjs/common';
import { PurevaFormService } from './pureva_form.service';
import { PurevaFormController } from './pureva_form.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PUREVA_FORM } from 'src/common/Entities/webform/table/PUREVA_FORM.entity';
import { PurevaFormRepository } from './pureva_form.repository';

@Module({
   imports: [TypeOrmModule.forFeature([PUREVA_FORM], 'webformConnection')],
  controllers: [PurevaFormController],
  providers: [PurevaFormService, PurevaFormRepository],
  exports:[PurevaFormService]
})
export class PurevaFormModule {}
