import { Controller, Get } from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('sp/customer')
export class CustomerController {
  constructor(private readonly cus: CustomerService) {}

  @Get()
  async findAll() {
    return await this.cus.findAll();
  }
}
