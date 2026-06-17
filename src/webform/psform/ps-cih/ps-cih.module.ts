import { Module } from '@nestjs/common';
import { PsCihService } from './ps-cih.service';
import { PsCihController } from './ps-cih.controller';
import { PsCihRepository } from './ps-cih.repository';
import { PsCiRepository } from '../ps-ci/ps-ci.repository';
import { HandleFileFormModule } from 'src/webform/handle-file-form/handle-file-form.module';


@Module({
  controllers: [PsCihController],
  providers: [PsCihService, PsCihRepository, PsCiRepository],
  imports:[HandleFileFormModule]
})
export class PsCihModule {}
