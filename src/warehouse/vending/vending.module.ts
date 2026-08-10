import { Module } from '@nestjs/common';
import { VendingService } from './vending.service';
import { VendingController } from './vending.controller';
import { VendingRepository } from './vending.repository';

@Module({
  controllers: [VendingController],
  providers: [VendingService,VendingRepository],
})
export class VendingModule {}
