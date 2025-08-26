import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ESCSItemService } from './item.service';
import { SearchEscsItemDto } from './dto/search-escs-item.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('ESCS Item')
@Controller('escs/item')
export class ESCSItemController {
  constructor(private readonly itemService: ESCSItemService) {}

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
  async getItem(@Body() searchDto: SearchEscsItemDto) {
    return this.itemService.getItem(searchDto);
  }
}
