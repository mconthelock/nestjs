import { Module } from '@nestjs/common';
import { FinpckVwstatusService } from './finpck-vwstatus.service';
import { FinpckVwstatusController } from './finpck-vwstatus.controller';
import { VWStatusRepository } from './finpck-vwstatus.repository';

@Module({
  controllers: [FinpckVwstatusController],
  providers: [FinpckVwstatusService,VWStatusRepository],
})
export class FinpckVwstatusModule {}
