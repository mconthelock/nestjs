import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';

import { Vendors } from 'src/common/Entities/pursys/table/VENDORS.entity';
import { PURVMM_FORM } from 'src/common/Entities/webform/table/PURVMM_FORM.entity';
import { PUREVA_FORM } from 'src/common/Entities/webform/table/PUREVA_FORM.entity';
import { PUR_FILE } from 'src/common/Entities/webform/table/PUR_FILE.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Vendors, PURVMM_FORM, PUREVA_FORM, PUR_FILE], 'mitsuConnection'),
    ],
    controllers: [VendorsController],
    providers: [VendorsService],
    exports: [VendorsService],
})
export class VendorsModule {}
