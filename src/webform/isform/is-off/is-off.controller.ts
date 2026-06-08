import { Controller, Get, Post, Body } from '@nestjs/common';
import { IsOffService } from './is-off.service';
import { CreateIsOffDto } from './dto/create-is-off.dto';
import { UpdateIsOffDto } from './dto/update-is-off.dto';
import { SearchIsOffDto } from './dto/search-is-off.dto';

@Controller('isform/is-off')
export class IsOffController {
    constructor(private readonly off: IsOffService) {}

    @Post('create')
    create(@Body() createIsOffDto: CreateIsOffDto) {
        return this.off.create(createIsOffDto);
    }

    @Post('search')
    search(@Body() searchIsOffDto: SearchIsOffDto) {
        return this.off.search(searchIsOffDto);
    }

    @Get('reason')
    findReason() {
        return this.off.findReason();
    }
}
