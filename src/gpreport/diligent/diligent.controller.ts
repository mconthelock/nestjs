import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DiligentService } from './diligent.service';
import { SearchDiligentDto } from './dto/search-diligent.dto';

@Controller('gpreport/diligent')
export class DiligentController {
    constructor(private readonly diligentService: DiligentService) {}

    @Post('search')
    search(@Body() searchDiligentDto: SearchDiligentDto) {
        return this.diligentService.search(searchDiligentDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.diligentService.findOne(id);
    }
}
