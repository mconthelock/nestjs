import { Controller, Post, Body } from '@nestjs/common';
import { VendorsService } from './vendors.service';

import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { SearchVendorDto } from './dto/search-vendor.dto';

@Controller('pursys/vendors')
export class VendorsController {
    constructor(private readonly vnd: VendorsService) {}

    @Post('search')
    findAll(@Body() dto: SearchVendorDto) {
        return this.vnd.search(dto);
    }

    @Post('create')
    create(@Body() dto: CreateVendorDto) {
        return this.vnd.create(dto);
    }

    @Post('next-vendor')
    nextVendor(@Body('code') code: any) {
        return this.vnd.nextVendor(code.first, code?.second);
    }
}
