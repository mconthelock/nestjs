import { Controller, Post, Body } from '@nestjs/common';
import { ItemsCustomerService } from './items-customer.service';
import { updateItemCustomerDto } from './dto/update-item-customer.dto';
@Controller('sp/items-customer')
export class ItemsCustomerController {
  constructor(private readonly cus: ItemsCustomerService) {}

  @Post('update')
  updateItemsCustomer(@Body() data: updateItemCustomerDto) {
    return this.cus.update(data);
  }
}
