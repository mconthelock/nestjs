import { Controller, Post, Body } from '@nestjs/common';
import { ItemsCustomerService } from './items-customer.service';

@Controller('items-customer')
export class ItemsCustomerController {
  constructor(private readonly cus: ItemsCustomerService) {}
}
