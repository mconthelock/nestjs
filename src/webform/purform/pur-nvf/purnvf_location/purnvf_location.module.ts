import { Module } from '@nestjs/common';
import { PurnvfLocationService } from './purnvf_location.service';
import { PurnvfLocationController } from './purnvf_location.controller';

@Module({
  controllers: [PurnvfLocationController],
  providers: [PurnvfLocationService],
})
export class PurnvfLocationModule {}
