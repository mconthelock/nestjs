import { Injectable } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VOrderList } from './entities/orderlist.entity';
import { CreateOrderListDto } from './dto/create-orderlist.dto';
import { UpdateOrderListDto } from './dto/update-orderlistr.dto';
import { SearchOrderListDto } from './dto/search-orderlist.dto';
import { log } from 'console';
import { getQueryFieldsBySelect, getSafeFields } from 'src/utils/getFields';

@Injectable()
export class OrderListService {
  constructor(
    @InjectRepository(VOrderList, 'amecConnection')
    private readonly OrderListRepository: Repository<VOrderList>,
  ) {}

  private readonly allowFields = ["ORDTYPE","URGENT","MAPPIC","SERIES","AGENT","PRJ_NO","MFGNO","ELV_NO","OPERATION","REQ","CUST_RQS","DESSCH","PRODSCH","DESPROD","DESBMDATE","MFG_SCHEDULE","MFGBMDATE","EXPSHIP","DUMMYCAR_NO","DUMMY_PRDN","DUMMY_ITEM","BUYERCODE","BUYEREMPNO","BUYERNAME","PRNO","LINENO","PRDATE","PONO","PODATE","VENDCODE","ITEM","PARTNAME","DRAWING","REMARK","REQUESTED_QTY","ORDERED_QTY","RECIEVE_QTY","DUEDATE","QTY","ACTUALETA_AMEC","INVOICE"];

  private readonly numberFields = ["REQUESTED_QTY" ,"ORDERED_QTY" ,"RECIEVE_QTY" ,"QTY" ,"ACTUALETA_AMEC" ,"LINENO" ,"VENDCODE" ,"PRNO" ,"PRDATE" ,"PONO" ,"PODATE" ,"DUEDATE"];

  private readonly dataFields = ["CUST_RQS", "DESSCH", "PRODSCH", "DESBMDATE", "MFGBMDATE", "EXPSHIP"];

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
    const query = this.setQuery(dto);
    
    const [sql, params] = query.getQueryAndParameters();
    console.log('SQL:', sql);
    console.log('Params:', params);


    return await query.getMany();
  }

  async searchByPage(dto: SearchOrderListDto) {
    const query = this.setQuery(dto);
    const { search = '', limit = 10, page = 1, fields = [] } = dto;

    if (search) {
        if (fields.length > 0) {
            const searchFields = getSafeFields(fields, [ 'PRNO', 'MFGNO', 'PRJ_NO', 'DRAWING', 'ITEM' ]);
            const [whereSql, whereParams] = getQueryFieldsBySelect(searchFields, this.numberFields, search);
            query.where(whereSql, whereParams);
        }else{
            query.where(
                'TO_CHAR(OrderList.PRNO) LIKE :search OR OrderList.MFGNO LIKE :search2 OR OrderList.PRJ_NO LIKE :search3 OR OrderList.DRAWING LIKE :search4 OR OrderList.ITEM LIKE :search5',
                { search: `%${search}%`, search2: `%${search}%`, search3: `%${search}%`, search4: `%${search}%`, search5: `%${search}%` }
            );
        }
    }
    query.skip((page - 1) * limit).take(limit);

    const [sql, params] = query.getQueryAndParameters();
    console.log('SQL:', sql);
    console.log('Params:', params);


    return await query.getManyAndCount().then(([data, count]) => ({
      data,
      recordsTotal: count, // key ที่ dataTable ต้องการ
      recordsFiltered: count, // key ที่ dataTable ต้องการ
      page,
      limit,
    }));
  }

  private setQuery(dto: SearchOrderListDto) {
    const { fields = [], ORDTYPE, PRJ_NO, MFGNO, BUYEREMPNO, BUYERNAME, PRNO, PRDATE, PONO, PODATE, LINENO, VENDCODE, ITEM, DRAWING, INVOICE, DUEDATE } = dto;
    const query = this.OrderListRepository.createQueryBuilder('OrderList');
    
    if (fields.length > 0) {
        const safeFields = getSafeFields(fields, this.allowFields);
        query.select(safeFields.map(f => `OrderList.${f}`));
    }
   
    if (ORDTYPE) query.andWhere('OrderList.ORDTYPE = :ORDTYPE', { ORDTYPE });
    if (PRJ_NO) query.andWhere('OrderList.PRJ_NO = :PRJ_NO', { PRJ_NO });
    if (MFGNO) query.andWhere('OrderList.MFGNO = :MFGNO', { MFGNO });
    if (BUYEREMPNO) query.andWhere('OrderList.BUYEREMPNO = :BUYEREMPNO', { BUYEREMPNO });
    if (BUYERNAME) query.andWhere('OrderList.BUYERNAME LIKE :BUYERNAME', { BUYERNAME: `%${BUYERNAME}%`});
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

    return query;
  }
}
