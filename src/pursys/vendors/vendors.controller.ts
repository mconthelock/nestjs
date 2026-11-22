import { Controller, Post, Body } from '@nestjs/common';
import { VendorsService } from './vendors.service';

import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { SearchVendorDto } from './dto/search-vendor.dto';
import { VendorCodeDto } from './dto/vendor-detail.dto';
import {
    SearchVendorGroupDto,
    LinkVendorCodesDto,
    SetPrimaryVendorCodeDto,
    UnlinkVendorCodeDto,
} from './dto/vendor-group.dto';

@Controller('pursys/vendors')
export class VendorsController {
    constructor(private readonly vnd: VendorsService) {}

    @Post('search')
    async findAll(@Body() dto: SearchVendorDto) {
        console.log(dto);

        return await this.vnd.search(dto);
    }

    @Post('create')
    create(@Body() dto: CreateVendorDto) {
        return this.vnd.create(dto);
    }

    @Post('next-vendor')
    nextVendor(@Body('code') code: { first: number; second?: number }) {
        return this.vnd.nextVendor(code.first, code?.second);
    }

    @Post('detail')
    async detail(@Body() dto: VendorCodeDto) {
        return await this.vnd.getDetail(dto.VENDCODE || dto.VND_CODE);
    }

    @Post('history')
    async history(@Body() dto: VendorCodeDto) {
        return await this.vnd.getHistory(dto.VENDCODE || dto.VND_CODE);
    }

    @Post('evaluation')
    async evaluation(@Body() dto: VendorCodeDto) {
        return await this.vnd.getEvaluation(dto.VENDCODE || dto.VND_CODE);
    }

    // =========================================================================
    // Multi-Code Vendor Grouping Endpoints (PURSYS.VENDORS_CODE)
    // =========================================================================

    @Post('groups/search')
    async searchGroups(@Body() dto: SearchVendorGroupDto) {
        return await this.vnd.searchGroups(dto);
    }

    @Post('groups/by-code')
    async getGroupByCode(@Body() dto: VendorCodeDto) {
        return await this.vnd.getGroupByCode(dto.VENDCODE || dto.VND_CODE);
    }

    @Post('groups/link')
    async linkGroupCodes(@Body() dto: LinkVendorCodesDto) {
        return await this.vnd.linkCodesToGroup(dto);
    }

    @Post('groups/set-primary')
    async setPrimaryCode(@Body() dto: SetPrimaryVendorCodeDto) {
        return await this.vnd.setPrimaryCode(dto);
    }

    @Post('groups/unlink')
    async unlinkGroupCode(@Body() dto: UnlinkVendorCodeDto) {
        return await this.vnd.unlinkCodeFromGroup(dto);
    }

    @Post('groups/suggestions')
    async groupSuggestions(@Body() dto: VendorCodeDto) {
        return await this.vnd.getGroupSuggestions(dto.VENDCODE || dto.VND_CODE);
    }
}
