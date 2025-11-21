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

  async findAll(data: updatePriceListDto) {
    return this.price.find({ relations: ['itemdesc'], where: { ...data } });
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

  async updatePrice(data: updatePriceListDto) {
    const item = this.price.find({
      where: {
        FYYEAR: data.FYYEAR,
        PERIOD: data.PERIOD,
        ITEM: data.ITEM,
        LATEST: '1',
      },
    });
    if (item) {
      await this.price.update(
        {
          FYYEAR: data.FYYEAR,
          PERIOD: data.PERIOD,
          ITEM: data.ITEM,
          LATEST: '1',
        },
        { LATEST: '0' },
      );
    }
    const newPrice = this.price.create(data);
    return this.price.save(newPrice);
  }
}
