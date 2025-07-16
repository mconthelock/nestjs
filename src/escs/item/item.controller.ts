import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemService } from './item.service';
import { SearchDto } from './dto/search.dto';

@Controller('escs/item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}


  @Get()
  getItemAll() {
    return this.itemService.getItemAll();
  }

  @Get(':item')
  getItemByItem(@Param('item') item: string) {
    return this.itemService.getItemByItem(item);
  }

  @Post('getItem')
  async getItem(@Body() searchDto: SearchDto) {
    return this.itemService.getItem(searchDto);
  }

}
