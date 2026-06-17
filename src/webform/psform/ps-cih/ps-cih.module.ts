import { Module } from '@nestjs/common';
import { PsCihService } from './ps-cih.service';
import { PsCihController } from './ps-cih.controller';
import { PsCihRepository } from './ps-cih.repository';
import { PsCiRepository } from '../ps-ci/ps-ci.repository';


@Module({
  controllers: [PsCihController],
  providers: [PsCihService, PsCihRepository, PsCiRepository],
})
export class PsCihModule {}
