import { Module } from '@nestjs/common';
import {PurVendorsCodeModule} from './pur_vendors_code/pur_vendors_code.module';
import {PurVendorsModule} from './pur_vendors/pur_vendors.module';
import { PurVendorsAttfileModule } from './pur_vendors_attfile/pur_vendors_attfile.module';
import { PurVendorsAddressModule } from './pur_vendors_address/pur_vendors_address.module';

@Module({
  imports: [
    PurVendorsModule,
    PurVendorsCodeModule,
    PurVendorsAttfileModule,
    PurVendorsAddressModule,
  ],
})
export class PursysModule {}
