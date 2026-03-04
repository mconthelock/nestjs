import { Module } from '@nestjs/common';
import {PurVendorsCodeModule} from './pur_vendors_code/pur_vendors_code.module';
import {PurVendorsModule} from './pur_vendors/pur_vendors.module';

@Module({
  imports: [
    PurVendorsModule,
    PurVendorsCodeModule,
  ],
})
export class PursysModule {}
