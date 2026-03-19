import { Controller, Get, Post, Body } from '@nestjs/common';
import { PprbiddingService } from './pprbidding.service';
import { CreatePprbiddingDto } from './dto/create-pprbidding.dto';
import { UpdatePprbiddingDto } from './dto/update-pprbidding.dto';
import { UseTransaction } from 'src/common/decorator/transaction.decorator';
import { FiltersDto } from 'src/common/dto/filter.dto';

@Controller('amec/pprbidding')
export class PprbiddingController {
    constructor(private readonly pprbiddingService: PprbiddingService) {}

    @Post()
    create(@Body() createPprbiddingDto: CreatePprbiddingDto) {
        return this.pprbiddingService.create(createPprbiddingDto);
    }

    @Get()
    findAll() {
        return this.pprbiddingService.findAll();
    }

    @Post('search')
    @UseTransaction('webformConnection')
    search(@Body() dto: FiltersDto) {
        return this.pprbiddingService.search(dto);
    }
}
