import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { FireService } from './fire.service';
import { CreateFireItemDto } from './dto/create-fire-item.dto';
import { UpdateFireItemDto } from './dto/update-fire-item.dto';
import { SearchFireItemDto } from './dto/search-fire-item.dto';

@Controller('fire')
export class FireController {
    constructor(private readonly fireService: FireService) {}

    @Get()
    search(@Query() query: SearchFireItemDto) {
        return this.fireService.search(query);
    }

    @Get(':fireCode')
    findOne(@Param('fireCode') fireCode: string) {
        return this.fireService.findOne(fireCode);
    }

    @Post()
    create(@Body() dto: CreateFireItemDto) {
        return this.fireService.create(dto);
    }

    @Patch(':fireCode')
    update(@Param('fireCode') fireCode: string, @Body() dto: UpdateFireItemDto) {
        return this.fireService.update(fireCode, dto);
    }

    @Delete(':fireCode')
    remove(@Param('fireCode') fireCode: string) {
        return this.fireService.remove(fireCode);
    }
}
