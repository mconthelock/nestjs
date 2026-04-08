import { Module } from '@nestjs/common';
import { PurVendorsAddressService } from './pur_vendors_address.service';
import { PurVendorsAddressController } from './pur_vendors_address.controller';

@Module({
  controllers: [PurVendorsAddressController],
  providers: [PurVendorsAddressService],
})
export class PurVendorsAddressModule {}
