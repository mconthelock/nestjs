import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { S011mpService } from './s011mp.service';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { SearchPackingDto, SearchPackingItemsDto } from './dto/search-s011mp.dto';

@Controller('datacenter/s011mp')
export class S011mpController {
    constructor(private readonly s011mpService: S011mpService) {}
    @Get()
    findAll() {
        return this.s011mpService.findAll();
    }

    @Get(':S11M01/:S11M02')
    findOne(@Param('S11M01') S11M01: string, @Param('S11M02') S11M02: string) {
        return this.s011mpService.findOne(S11M01, S11M02);
    }

    @Post('search')
    @UseTransaction('datacenterConnection')
    async search(@Body() dto: FiltersDto) {
        return this.s011mpService.search(dto);
    }

    @Post('packing')
    async findPacking(@Body() dto: SearchPackingDto) {
        return this.s011mpService.findPacking(dto.ORDER);
    }

    @Post('packing-diff')
    async findPackingDiff(@Body() dto: SearchPackingDto) {
        return this.s011mpService.findPackingDiff(dto.ORDER);
    }

    @Post('packing-items')
    async findOrderItems(@Body() dto: SearchPackingItemsDto) {
        return this.s011mpService.findPacking(dto.ORDER, dto.ITEM);
    }
}
