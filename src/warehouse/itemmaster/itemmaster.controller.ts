import { Controller, Body, Post } from '@nestjs/common';
import { ItemmasterService } from './itemmaster.service';
import { CreateItemmasterDto } from './dto/create-itemmaster.dto';
import { UpdateItemmasterDto } from './dto/update-itemmaster.dto';
import { SearchItemmasterDto } from './dto/search-itemmaster.dto';

@Controller('warehouse/itemmaster')
export class ItemmasterController {
    constructor(private readonly itm: ItemmasterService) {}

    @Post('findall')
    create(@Body() dto: SearchItemmasterDto) {
        return this.itm.findAll(dto);
    }
}
