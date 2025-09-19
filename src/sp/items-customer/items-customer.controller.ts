import { Controller } from '@nestjs/common';
import { ItemsCustomerService } from './items-customer.service';

@Controller('items-customer')
export class ItemsCustomerController {
  constructor(private readonly itemsCustomerService: ItemsCustomerService) {}
}
