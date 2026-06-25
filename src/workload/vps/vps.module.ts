import { Module } from '@nestjs/common';
import { VpsService } from './vps.service';
import { VpsController } from './vps.controller';
import { VpsRepository } from './vps.repository';


@Module({
  controllers: [VpsController],

  providers: [VpsService, VpsRepository],
})
export class VpsModule {}
