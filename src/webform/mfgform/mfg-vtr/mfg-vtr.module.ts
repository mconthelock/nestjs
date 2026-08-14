import { Module } from '@nestjs/common';
import { MfgVtrService } from './mfg-vtr.service';
import { MfgVtrController } from './mfg-vtr.controller';

@Module({
  controllers: [MfgVtrController],
  providers: [MfgVtrService],
})
export class MfgVtrModule {}
