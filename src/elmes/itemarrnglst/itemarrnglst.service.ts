import { Itemarrnglst } from './entities/itemarrnglst.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ItemarrnglstService {
  constructor(
    @InjectRepository(Itemarrnglst, 'amecConnection')
    private readonly items: Repository<Itemarrnglst>,
  ) {}

  findOrders(ordno: string, item: string) {
    return this.items.find({
      where: { ORDERNO: ordno, ITEMNO: item },
      order: { SERIALNO: 'ASC' },
    });
  }
}
