import { Module } from '@nestjs/common';
import { FinpckFormService } from './finpck_form.service';
import { FinpckFormController } from './finpck_form.controller';
import { FinpckFormRepository } from './finpck_form.repository';

@Module({
  controllers: [FinpckFormController],
  providers: [FinpckFormService, FinpckFormRepository],
  exports: [FinpckFormService, FinpckFormRepository]
})
export class FinpckFormModule {}
