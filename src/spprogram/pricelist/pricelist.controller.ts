import { Controller, Post, Body } from '@nestjs/common';
import { PricelistService } from './pricelist.service';

import { createPriceListDto } from './dto/create-price.dto';
import { updatePriceListDto } from './dto/update-price.dto';

@Controller('sp/pricelist')
export class PricelistController {
  constructor(private readonly price: PricelistService) {}

  @Post('search')
  search(@Body() data: updatePriceListDto) {
    return this.price.findAll(data);
  }

  @Post('customer')
  findCustomer(@Body() data: any[]) {
    return this.price.findCustomer(data);
  }

  @Post('update')
  updatePrice(@Body() data: updatePriceListDto) {
    return this.price.updatePrice(data);
  }
}
