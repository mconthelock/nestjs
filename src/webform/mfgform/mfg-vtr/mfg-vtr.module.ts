import { Module } from '@nestjs/common';
import { MfgVtrService } from './mfg-vtr.service';
import { MfgVtrController } from './mfg-vtr.controller';
import { MfgVtrRepository } from './mfg-vtr.repository';
@Module({
  controllers: [MfgVtrController],
  providers: [MfgVtrService, MfgVtrRepository],
})
export class MfgVtrModule {}

