import { Module } from '@nestjs/common';
import { WMSModule } from './wms/wms.module';
import { ItemmasterModule } from './itemmaster/itemmaster.module';

@Module({
  imports: [
    WMSModule,
    ItemmasterModule,
  ]
})
export class WarehouseModule {}