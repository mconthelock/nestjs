import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { Pricelist } from './entities/pricelist.entity';
import { ItemsCustomer } from '../items-customer/entities/items-customer.entity';

import { createPriceListDto } from './dto/create-price.dto';
import { updatePriceListDto } from './dto/update-price.dto';

@Injectable()
export class PricelistService {
  constructor(
    @InjectRepository(Pricelist, 'spsysConnection')
    private readonly price: Repository<Pricelist>,

    @InjectRepository(ItemsCustomer, 'spsysConnection')
    private readonly itemscus: Repository<ItemsCustomer>,
  ) {}

  async findAll() {
    return this.price.find({ relations: ['itemdesc'] });
  }

  async findCustomer(data: any) {
    return this.itemscus.find({
      relations: ['itemdesc', 'itemdesc.prices', 'customer', 'customer.rate'],
      where: {
        ...data,
        itemdesc: {
          ITEM_STATUS: 1,
          prices: {
            LATEST: 1,
          },
        },
      },
    });
  }

  async createPrice(data: createPriceListDto) {
    return this.price.save(data);
  }

  async updatePrice(data: updatePriceListDto) {
    return this.price.save(data);
  }
}
