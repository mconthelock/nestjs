import { Module } from '@nestjs/common';
import { PurVendorsAttfileService } from './pur_vendors_attfile.service';
import { PurVendorsAttfileController } from './pur_vendors_attfile.controller';

@Module({
  controllers: [PurVendorsAttfileController],
  providers: [PurVendorsAttfileService],
})
export class PurVendorsAttfileModule {}
