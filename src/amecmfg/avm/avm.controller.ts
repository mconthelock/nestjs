import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AvmService } from './avm.service';
import { SearchAvmDto } from './dto/search-avm.dto';

@Controller('avm')
export class AvmController {
    constructor(private readonly avmService: AvmService) {}

    @Get()
    findAll() {
        return this.avmService.findAll();
    }

    @Post('search')
    search(@Body() searchAvmDto: SearchAvmDto) {
        return this.avmService.search(searchAvmDto);
    }

    @Get('genVendCode')
    async genVendCode(@Query('prefix') prefix: string) {
        const targetPrefix = prefix || '6';
        const newVendorCode = await this.avmService.genVendCode(targetPrefix);
        return newVendorCode;
    }
}
