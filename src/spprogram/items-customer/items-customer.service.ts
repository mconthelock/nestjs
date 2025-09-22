import { ItemsCustomer } from './entities/items-customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemsCustomerService {
  constructor(
    @InjectRepository(ItemsCustomer, 'spsysConnection')
    private readonly itemscus: Repository<ItemsCustomer>,
  ) {}

  findAll(data: any) {
    return this.itemscus.find({ relations: ['prices'] });
  }
}
