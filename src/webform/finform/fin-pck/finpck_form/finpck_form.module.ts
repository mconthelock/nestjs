import { Module } from '@nestjs/common';
import { FinpckFormService } from './finpck_form.service';
import { FinpckFormController } from './finpck_form.controller';

@Module({
  controllers: [FinpckFormController],
  providers: [FinpckFormService],
})
export class FinpckFormModule {}
