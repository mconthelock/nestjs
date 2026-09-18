import { Module } from '@nestjs/common';
import { VendingService } from './vending.service';
import { VendingController } from './vending.controller';
import { VendingRepository } from './vending.repository';
import { FormModule } from 'src/webform/form/form.module';
import { StocksModule } from 'src/pursys/stocks/stocks.module';

@Module({
  controllers: [VendingController],
  providers: [VendingService,VendingRepository],
  imports: [FormModule,StocksModule],
})
export class VendingModule {}
