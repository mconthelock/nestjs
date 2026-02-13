import { Module } from '@nestjs/common';
import { WMSModule } from './wms/wms.module';

@Module({
  imports: [
    WMSModule,
  ]
})
export class WarehouseModule {}