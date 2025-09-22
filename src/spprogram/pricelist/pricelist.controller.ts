import { Controller, Post, Body } from '@nestjs/common';
import { PricelistService } from './pricelist.service';

@Controller('sp/pricelist')
export class PricelistController {
  constructor(private readonly price: PricelistService) {}

  @Post('search')
  search(@Body() data: any[]) {
    return this.price.findAll();
  }

  @Post('customer')
  findCustomer(@Body() data: any[]) {
    return this.price.findCustomer(data);
  }
}
