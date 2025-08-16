import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer, 'amecConnection')
    private readonly cus: Repository<Customer>,
  ) {}

  async findAll() {
    return this.cus.find();
  }
}
