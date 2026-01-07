import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { ItemsCustomerService } from './items-customer.service';

import { createItemCustomerDto } from './dto/create-item-customer.dto';
import { updateItemCustomerDto } from './dto/update-item-customer.dto';

@Controller('sp/items-customer')
export class ItemsCustomerController {
  constructor(private readonly cus: ItemsCustomerService) {}

  @Post('create')
  createItemsCustomer(@Body() data: createItemCustomerDto) {
    return this.cus.crete(data);
  }

  @Post('update')
  updateItemsCustomer(@Body() data: updateItemCustomerDto) {
    return this.cus.update(data);
  }

  @Delete('delete')
  deleteItemsCustomer(@Body() body: { CUSTOMER_ID: number; ITEMS_ID: number }) {
    return this.cus.delete(body.CUSTOMER_ID, body.ITEMS_ID);
  }
}
