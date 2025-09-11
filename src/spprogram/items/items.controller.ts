import { Controller, Post, Body } from '@nestjs/common';
import { ItemsService } from './items.service';

import { searchItemsDto } from './dto/searchItems.dto';

@Controller('sp/items')
export class ItemsController {
  constructor(private readonly items: ItemsService) {}

  @Post('search')
  findItems(@Body() data: searchItemsDto) {
    return this.items.findAll(data);
  }

  @Post('finitem')
  findFinItems(@Body() data: searchItemsDto) {
    data.CATEGORY = 31;
    return this.items.findAll(data);
  }
}
