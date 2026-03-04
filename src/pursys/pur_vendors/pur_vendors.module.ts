import { Module } from '@nestjs/common';
import { PurVendorsService } from './pur_vendors.service';
import { PurVendorsController } from './pur_vendors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurVendor } from './entities/pur_vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PurVendor], 'purConnection')],
  controllers: [PurVendorsController],
  providers: [PurVendorsService],
})
export class PurVendorsModule {}
