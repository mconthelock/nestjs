import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VOrderList } from './entities/orderlist.entity';
import { CreateOrderListDto } from './dto/create-orderlist.dto';
import { UpdateOrderListDto } from './dto/update-orderlistr.dto';
import { SearchOrderListDto } from './dto/search-orderlist.dto';
import { log } from 'console';

@Injectable()
export class OrderListService {
  constructor(
    @InjectRepository(VOrderList, 'amecConnection')
    private readonly OrderListRepository: Repository<VOrderList>,
  ) {}

  findAll() {
    return this.OrderListRepository.find();
  }

  async findOne(PRNO: number) {
    const data = await this.OrderListRepository.findOne({
      where: { PRNO: PRNO },
    });
    return data;
  }

  async search(dto: SearchOrderListDto) {
    console.log('PRNO typeof:', typeof dto.PRNO, dto.PRNO);
    const { ORDTYPE, PRJ_NO, MFGNO, BUYEREMPNO, BUYERNAME, PRNO, PRDATE, PONO, PODATE, LINENO, VENDCODE, ITEM, DRAWING, INVOICE, DUEDATE } = dto;
    const query = this.OrderListRepository.createQueryBuilder('OrderList');

    if (ORDTYPE) query.andWhere('OrderList.ORDTYPE = :ORDTYPE', { ORDTYPE });
    if (PRJ_NO) query.andWhere('OrderList.PRJ_NO = :PRJ_NO', { PRJ_NO });
    if (MFGNO) query.andWhere('OrderList.MFGNO = :MFGNO', { MFGNO });
    if (BUYEREMPNO) query.andWhere('OrderList.BUYEREMPNO = :BUYEREMPNO', { BUYEREMPNO });
    if (BUYERNAME) query.andWhere('OrderList.BUYERNAME LIKE :BUYERNAME', { BUYERNAME: `%${BUYERNAME}%` });
    if (PRNO) query.andWhere('OrderList.PRNO = :PRNO', { PRNO });
    if (PRDATE) query.andWhere('OrderList.PRDATE = :PRDATE', { PRDATE });
    if (PONO) query.andWhere('OrderList.PONO = :PONO', { PONO });
    if (PODATE) query.andWhere('OrderList.PODATE = :PODATE', { PODATE });
    if (LINENO) query.andWhere('OrderList.LINENO = :LINENO', { LINENO });
    if (VENDCODE) query.andWhere('OrderList.VENDCODE = :VENDCODE', { VENDCODE });
    if (ITEM) query.andWhere('OrderList.ITEM LIKE :ITEM', { ITEM: `%${ITEM}%` });
    if (DRAWING) query.andWhere('OrderList.DRAWING LIKE :DRAWING', { DRAWING: `%${DRAWING}%` });
    if (INVOICE) query.andWhere('OrderList.INVOICE LIKE :INVOICE', { INVOICE: `%${INVOICE}%` });
    if (DUEDATE) query.andWhere('OrderList.DUEDATE = :DUEDATE', { DUEDATE });

    return await query.getMany();
  }

  async serversite(dto: SearchOrderListDto) {
    const { search = '', limit = 10, page = 1 } = dto;
    const query = this.OrderListRepository.createQueryBuilder('OrderList');
    if (search) {
        query.andWhere(
            'TO_CHAR(OrderList.PRNO) LIKE :search',
            { search: `%${search}%` },
        );
    } 

    query.skip((page - 1) * limit).take(limit);

    return await query.getManyAndCount().then(([data, count]) => ({
      data,
      count,
      page,
      limit,
    }));
  }
}
