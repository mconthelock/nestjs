import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { SearchEscsItemDto } from './dto/search-escs-item.dto';

@Injectable()
export class ESCSItemService {
  constructor(
    @InjectRepository(Item, 'escsConnection')
    private itemRepo: Repository<Item>,
  ) {}

  getItemAll() {
    return this.itemRepo.find({
        order: {
            IT_NO: 'ASC',
        },
    });
  }

  getItemByItem(item: string) {
    return this.itemRepo.findOne({
      where: { IT_NO: item },
      order: {
        IT_NO: 'ASC',
      },
    });
  }

  getItem(searchDto: SearchEscsItemDto) {
    const { IT_NO, IT_USERUPDATE, IT_STATUS, SEC_ID, IT_QCDATE, IT_MFGDATE } = searchDto;
    return this.itemRepo.find({
      where: [
        { IT_NO ,
         IT_USERUPDATE ,
         IT_STATUS ,
         SEC_ID ,
         IT_QCDATE ,
         IT_MFGDATE },
      ],
      order: {
        IT_NO: 'ASC',
      },
    });
  }
}
