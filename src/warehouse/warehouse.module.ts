import { Module } from '@nestjs/common';
import { WMSModule } from './wms/wms.module';
import { ItemmasterModule } from './itemmaster/itemmaster.module';
import { CheckinventoryModule } from './checkinventory/checkinventory.module';


@Module({
  imports: [
    WMSModule,
    ItemmasterModule,
    CheckinventoryModule,
  ]
})
export class WarehouseModule {}