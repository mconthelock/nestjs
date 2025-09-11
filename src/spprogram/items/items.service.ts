import { Items } from './entities/items.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { searchItemsDto } from './dto/searchItems.dto';
@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Items, 'spsysConnection')
    private readonly items: Repository<Items>,
  ) {}

  async findAll(query: searchItemsDto) {
    const qb = this.items
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.prices', 'price', 'price.LATEST = :latest', {
        latest: 1,
      });

    Object.entries(query).forEach(([key, value]) => {
      if (!value) return;

      if (key === 'ITEM_NAME') {
        qb.andWhere(`item.${key} LIKE :${key}`, { [key]: `${value}%` });
      } else {
        qb.andWhere(`item.${key} = :${key}`, { [key]: value });
      }
    });

    return qb.getMany();
  }
}
