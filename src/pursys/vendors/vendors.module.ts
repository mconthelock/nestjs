import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';

import { Vendors } from 'src/common/Entities/pursys/table/VENDORS.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Vendors], 'purConnection')],
    controllers: [VendorsController],
    providers: [VendorsService],
})
export class VendorsModule {}
