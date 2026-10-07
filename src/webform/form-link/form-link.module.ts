import { Module } from '@nestjs/common';
import { FormLinkService } from './form-link.service';
import { FormLinkRepository } from './form-link.repository';

@Module({
  providers: [FormLinkService, FormLinkRepository],
})
export class FormLinkModule {}
