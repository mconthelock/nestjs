import { Module } from '@nestjs/common';
import { WMSModule } from './wms/wms.module';
import { ItemmasterModule } from './itemmaster/itemmaster.module';
import { CheckinventoryModule } from './checkinventory/checkinventory.module';
import { VendingModule } from './vending/vending.module';


@Module({
  imports: [
    WMSModule,
    ItemmasterModule,
    CheckinventoryModule,
    VendingModule,
  ]
})
export class WarehouseModule {}