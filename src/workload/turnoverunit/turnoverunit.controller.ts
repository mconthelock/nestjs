import { Controller, Get, Post, Body } from '@nestjs/common';
import { TurnoverunitService } from './turnoverunit.service';

import { CreateTurnoverunitDto } from './dto/create-turnoverunit.dto';
import { UpdateTurnoverunitDto } from './dto/update-turnoverunit.dto';
import { SearchTurnoverunitDto } from './dto/search-turnoverunit.dto';

@Controller('workload/turnoverunit')
export class TurnoverunitController {
    constructor(private readonly turnoverunitService: TurnoverunitService) {}

    @Post('search')
    search(@Body() dto: SearchTurnoverunitDto) {
        return this.turnoverunitService.search(dto);
    }
}
