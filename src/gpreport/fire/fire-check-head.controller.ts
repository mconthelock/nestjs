import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FireCheckHeadService } from './fire-check-head.service';
import { CreateFireCheckHeadDto } from './dto/create-fire-check-head.dto';
import { UpdateFireCheckHeadDto } from './dto/update-fire-check-head.dto';
import { SearchFireCheckHeadDto } from './dto/search-fire-check-head.dto';
import { FireCheckHeadKeyDto } from './dto/fire-check-key.dto';

@Controller('fire/check-heads')
export class FireCheckHeadController {
    constructor(private readonly headService: FireCheckHeadService) {}

    @Get('')
    searchCheckHeads(@Query() query: SearchFireCheckHeadDto) {
        return this.headService.searchCheckHeads(query);
    }

    @Get(':NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO')
    findCheckHead(@Param() key: FireCheckHeadKeyDto) {
        return this.headService.findCheckHead(key);
    }

    @Post('')
    createCheckHead(@Body() dto: CreateFireCheckHeadDto) {
        return this.headService.createCheckHead(dto);
    }

    @Patch(':NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO')
    updateCheckHead(@Param() key: FireCheckHeadKeyDto, @Body() dto: UpdateFireCheckHeadDto) {
        return this.headService.updateCheckHead(key, dto);
    }

    @Delete(':NFRMNO/:VORGNO/:CYEAR/:CYEAR2/:NRUNNO')
    removeCheckHead(@Param() key: FireCheckHeadKeyDto) {
        return this.headService.removeCheckHead(key);
    }
}
