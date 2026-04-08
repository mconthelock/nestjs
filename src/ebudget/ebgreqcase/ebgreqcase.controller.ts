import { Controller, Get, Param } from '@nestjs/common';
import { EbgreqcaseService } from './ebgreqcase.service';

@Controller('ebudget/case')
export class EbgreqcaseController {
    constructor(private readonly ebgreqcaseService: EbgreqcaseService) {}

    @Get()
    findAll() {
        return this.ebgreqcaseService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.ebgreqcaseService.findOne(id);
    }
}
