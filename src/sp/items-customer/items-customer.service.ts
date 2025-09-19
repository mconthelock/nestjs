import { ItemsCustomer } from './entities/items-customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsCustomerService {
  constructor(
    @InjectRepository(ItemsCustomer, 'amecConnection')
    private readonly items-customerRepository: Repository<ItemsCustomer>,
  ) {}
}
