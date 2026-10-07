import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { RncauseService } from './rncause.service';

@Controller('webform/rncause')
export class RncauseController {
    constructor(private readonly rncauseService: RncauseService) {}

    @Get()
    findAll() {
        return this.rncauseService.findAll();
    }

    @Get(':cid')
    findOne(@Param('cid') cid: number) {
        return this.rncauseService.findOne(cid);
    }

    @Post('search')
    @UseTransaction('webformConnection')
    search(@Body() dto: FiltersDto) {
        return this.rncauseService.search(dto);
    }
}