import { ItemsCustomer } from './entities/items-customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { createItemCustomerDto } from './dto/create-item-customer.dto';
import { updateItemCustomerDto } from './dto/update-item-customer.dto';

@Injectable()
export class ItemsCustomerService {
  constructor(
    @InjectRepository(ItemsCustomer, 'spsysConnection')
    private readonly itemscus: Repository<ItemsCustomer>,
  ) {}

  findAll(data: any) {
    return this.itemscus.find({ relations: ['prices'] });
  }

  crete(data: createItemCustomerDto) {
    return this.itemscus.save(data);
  }

  update(data: updateItemCustomerDto) {
    return this.itemscus.save(data);
  }

  delete(cusId: number, itemId: number) {
    return this.itemscus.delete({ CUSTOMER_ID: cusId, ITEMS_ID: itemId });
  }
}
