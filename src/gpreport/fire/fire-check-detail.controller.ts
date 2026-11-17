import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FireCheckDetailService } from './fire-check-detail.service';
import { CreateFireCheckDetailDto } from './dto/create-fire-check-detail.dto';
import { UpdateFireCheckDetailDto } from './dto/update-fire-check-detail.dto';
import { SearchFireCheckDetailDto } from './dto/search-fire-check-detail.dto';
import { FireCheckDetailKeyDto } from './dto/fire-check-key.dto';

@Controller('fire/check-details')
export class FireCheckDetailController {
    constructor(private readonly detailService: FireCheckDetailService) {}

    @Get('')
    searchCheckDetails(@Query() query: SearchFireCheckDetailDto) {
        return this.detailService.searchCheckDetails(query);
    }

    @Get(':NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/:ID/:FIRE_CODE')
    findCheckDetail(@Param() key: FireCheckDetailKeyDto) {
        return this.detailService.findCheckDetail(key);
    }

    @Post('')
    createCheckDetail(@Body() dto: CreateFireCheckDetailDto) {
        return this.detailService.createCheckDetail(dto);
    }

    @Patch(':NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/:ID/:FIRE_CODE')
    updateCheckDetail(@Param() key: FireCheckDetailKeyDto, @Body() dto: UpdateFireCheckDetailDto) {
        return this.detailService.updateCheckDetail(key, dto);
    }

    @Delete(':NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO/:ID/:FIRE_CODE')
    removeCheckDetail(@Param() key: FireCheckDetailKeyDto) {
        return this.detailService.removeCheckDetail(key);
    }
}
