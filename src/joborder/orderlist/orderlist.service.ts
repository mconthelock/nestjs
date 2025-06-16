import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VOrderList } from './entities/orderlist.entity';
import { SearchOrderListDto } from './dto/search-orderlist.dto';
import { getQueryFieldsBySelect, getSafeFields, mapAliasesToFields } from 'src/utils/Fields';
import { logQuery } from 'src/utils/debug';

@Injectable()
export class OrderListService {
    constructor(
        @InjectRepository(VOrderList, 'amecConnection')
        private readonly OrderListRepository: Repository<VOrderList>,
    ) {}

    private readonly allowFields = ["ORDTYPE","URGENT","MAPPIC","SERIES","AGENT","PRJ_NO", "PRJ_NAME", "COUNTRY","MFGNO","ELV_NO","OPERATION","REQ","CUST_RQS","DESSCH","PRODSCH","DESPROD","DESBMDATE","MFG_SCHEDULE","MFGBMDATE","EXPSHIP","DUMMYCAR_NO","DUMMY_PRDN","DUMMY_ITEM","BUYERCODE","BUYEREMPNO","BUYERNAME","PRNO","LINENO","PRDATE","PONO","PODATE","VENDCODE","ITEM","PARTNAME","DRAWING","REMARK","REQUESTED_QTY","ORDERED_QTY","RECIEVE_QTY","DUEDATE","QTY","ACTUALETA_AMEC","INVOICE", "JOP_REQUESTDATE", "JOP_PUR_STATUS"];

    private readonly numberFields = ["REQUESTED_QTY" ,"ORDERED_QTY" ,"RECIEVE_QTY" ,"QTY" ,"ACTUALETA_AMEC" ,"LINENO" ,"VENDCODE" ,"PRNO" ,"PRDATE" ,"PONO" ,"PODATE" ,"DUEDATE"];

    private readonly dataFields = ["CUST_RQS", "DESSCH", "PRODSCH", "DESBMDATE", "MFGBMDATE", "EXPSHIP"];


    /**
     * Search for order lists
     * @param dto SearchOrderListDto
     * @returns 
     */
    async orderlist(dto: SearchOrderListDto) {
        const query = this.setQuery(dto);
        // logQuery(query);
        const data = await query.getRawMany();
        return mapAliasesToFields(data);
        // return await query.getMany();
    }

    async orderlistByPage(dto: SearchOrderListDto) {
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
        // หากใช้ getManyAndCount ต้องใช้ skip, take แทน limit, offset
        // query.skip((page - 1) * limit).take(limit);
        // return await query.getManyAndCount().then(([data, count]) => ({
        //   data,
        //   recordsTotal: count, // key ที่ dataTable ต้องการ
        //   recordsFiltered: count, // key ที่ dataTable ต้องการ
        //   page,
        //   limit,
        // }));
    
        const qCount = this.setQuery(dto, 'count');
        const count = await qCount.getCount();
        
        query.limit(limit).offset((page - 1) * limit);
        // logQuery(query);
        const data = await query.getRawMany();
        return {
            data: mapAliasesToFields(data),
            recordsTotal: count, // key ที่ dataTable ต้องการ
            recordsFiltered: count, // key ที่ dataTable ต้องการ
            page,
            limit,
        }
    }

    async confirm(dto: SearchOrderListDto) {
        const query = this.setQuery(dto);
        // logQuery(query);
        query.andWhere('J.JOP_PUR_STATUS = :status', { status: 0 }); // 0 = ยังไม่ confirm
        const data = await query.getRawMany();
        return mapAliasesToFields(data);
    }

    async shipment(dto: SearchOrderListDto) {
        const query = this.setQuery(dto);
        // logQuery(query);
        query.andWhere('O.REQUESTED_QTY != O.RECIEVE_QTY'); // เงื่อนไขนี้จะเลือกเฉพาะรายการที่ยังไม่ได้รับสินค้าครบตามจำนวนที่สั่ง
        const data = await query.getRawMany();
        return mapAliasesToFields(data);
    }


    private setQuery(dto: SearchOrderListDto, type : string = 'data') {
        const { fields = [], ORDTYPE, PRJ_NO, MFGNO, BUYEREMPNO, BUYERNAME, PRNO, PRDATE, PONO, PODATE, LINENO, VENDCODE, ITEM, DRAWING, INVOICE, DUEDATE } = dto;
        const query = this.OrderListRepository.createQueryBuilder('O');
        if (ORDTYPE) query.andWhere('O.ORDTYPE = :ORDTYPE', { ORDTYPE });
        if (PRJ_NO) query.andWhere('O.PRJ_NO = :PRJ_NO', { PRJ_NO });
        if (MFGNO) query.andWhere('O.MFGNO = :MFGNO', { MFGNO });
        if (BUYEREMPNO) query.andWhere('O.BUYEREMPNO = :BUYEREMPNO', { BUYEREMPNO });
        if (BUYERNAME) query.andWhere('O.BUYERNAME LIKE :BUYERNAME', { BUYERNAME: `%${BUYERNAME}%`});
        if (PRNO) query.andWhere('O.PRNO = :PRNO', { PRNO });
        if (PRDATE) query.andWhere('O.PRDATE = :PRDATE', { PRDATE });
        if (PONO) query.andWhere('O.PONO = :PONO', { PONO });
        if (PODATE) query.andWhere('O.PODATE = :PODATE', { PODATE });
        if (LINENO) query.andWhere('O.LINENO = :LINENO', { LINENO });
        if (VENDCODE) query.andWhere('O.VENDCODE = :VENDCODE', { VENDCODE });
        if (ITEM) query.andWhere('O.ITEM LIKE :ITEM', { ITEM: `%${ITEM}%` });
        if (DRAWING) query.andWhere('O.DRAWING LIKE :DRAWING', { DRAWING: `%${DRAWING}%` });
        if (INVOICE) query.andWhere('O.INVOICE LIKE :INVOICE', { INVOICE: `%${INVOICE}%` });
        if (DUEDATE) query.andWhere('O.DUEDATE = :DUEDATE', { DUEDATE });

        if (type === 'count') {
            return query;
        } else if (type === 'data') {
            if (fields.length > 0) {
                const safeFields = getSafeFields(fields, this.allowFields);
                query.select(safeFields.map(f => ['JOP_REQUESTDATE','JOP_PUR_STATUS'].includes(f) ? `J.${f}` : `O.${f}`));
            }
            // query.leftJoinAndSelect('JOP_REQ', 'J', 'O.PRNO = J.JOP_PONO and O.LINENO = J.JOP_LINENO'); // จะ join และ select ให้ทั้งหมด
            query.leftJoin('JOP_REQ', 'J', 'O.PRNO = J.JOP_PONO and O.LINENO = J.JOP_LINENO'); //  join อย่างเดียวหากอยากได้ column ไหนต้อง select เอง
            return query;
        }
    }
  
}
