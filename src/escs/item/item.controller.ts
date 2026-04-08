import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ItemService } from './item.service';
import { SearchItemDto } from './dto/search-escs-item.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('ESCS Item')
@Controller('escs/item')
export class ItemController {
    constructor(private readonly itemService: ItemService) {}

    @Get()
    @ApiOperation({
        summary: 'getItemAll',
    })
    getItemAll() {
        return this.itemService.getItemAll();
    }

    @Get(':item')
    @ApiOperation({
        summary: 'getItemByItem',
    })
    @ApiParam({ name: 'item', example: '101-01', required: true })
    getItemByItem(@Param('item') item: string) {
        return this.itemService.getItemByItem(item);
    }

    @Post('getItem')
    @ApiOperation({
        summary: 'getItem',
    })
    async getItem(@Body() searchDto: SearchItemDto) {
        return this.itemService.getItem(searchDto);
    }
}
