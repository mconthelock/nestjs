import { Module } from '@nestjs/common';
import { CheckinventoryService } from './checkinventory.service';
import { CheckinventoryController } from './checkinventory.controller';
import { CheckinventoryRepository } from './checkinventory.repository';

@Module({
  controllers: [CheckinventoryController],
  providers: [CheckinventoryService, CheckinventoryRepository],
})
export class CheckinventoryModule {}
