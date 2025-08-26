import { Injectable } from '@nestjs/common';
import { Repository, DataSource, Like, Not, In } from 'typeorm';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { SearchOrderDto } from './dto/search-orders.dto';
import { Orders } from './entities/order.entity';
import { logQuery } from 'src/common/utils/debug.utils';

@Injectable()
export class ESCSOrdersService {
  constructor(
    @InjectRepository(Orders, 'amecConnection')
    private ordersRepo: Repository<Orders>,
  ) {}
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async checkOrderPartSupply(dto: SearchOrderDto): Promise<{
    status: boolean;
    data?: Orders[];
  }> {
    const query =  this.ordersRepo.createQueryBuilder('orders');
    if(dto.ORD_NO) query.andWhere('orders.ORD_NO like :ordNo', { ordNo: `%${dto.ORD_NO}%` });
    if(dto.ORD_ITEM) query.andWhere('orders.ORD_ITEM like :ordItem', { ordItem: `${dto.ORD_ITEM}%` });
    if(dto.ORD_PRODUCTION) query.andWhere('orders.ORD_PRODUCTION = :ordProduction', { ordProduction: dto.ORD_PRODUCTION });

    query.andWhere("((orders.ORT_ID = 5 AND NOT(ORD_NO LIKE 'ET9%' AND ORD_MODEL='VPC')) OR (ORT_ID IN (4,6)))");
    logQuery(query);
    const data = await query.getMany();

    if (data.length > 0) {
      return { status: true, data };
    } else {
      return { status: false };
    }
  }
}
