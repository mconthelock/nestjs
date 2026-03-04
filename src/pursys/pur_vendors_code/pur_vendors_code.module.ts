import { Module } from '@nestjs/common';
import { PurVendorsCodeService } from './pur_vendors_code.service';
import { PurVendorsCodeController } from './pur_vendors_code.controller';

@Module({
  controllers: [PurVendorsCodeController],
  providers: [PurVendorsCodeService],
})
export class PurVendorsCodeModule {}
