import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource  } from 'typeorm';
import { VOrderList } from './entities/orderlist.entity';
import { SetRequestDate } from '../set-request-date/entities/set-request-date.entity';
import { SearchOrderListDto } from './dto/search-orderlist.dto';
import { getSafeFields, mapAliasesToFields } from 'src/common/utils/Fields.utils';

import { numberToAlphabetRevision } from 'src/common/utils/format.utils';
import { JopMarReqService } from '../jop-mar-req/jop-mar-req.service';
import { JopPurConfService } from '../jop-pur-conf/jop-pur-conf.service';

@Injectable()
export class OrderListService {
    constructor(
        @InjectRepository(VOrderList, 'amecConnection')
        private readonly OrderListRepository: Repository<VOrderList>,
        @InjectRepository(SetRequestDate, 'amecConnection')
        private readonly SetRequestDateRepository: Repository<SetRequestDate>,
        @InjectDataSource('amecConnection')
        private dataSource: DataSource,
        private readonly JopMarReqService: JopMarReqService,
        private readonly JopPurConfService: JopPurConfService,
    ) {}

    private readonly JOBORDER = this.OrderListRepository.metadata.columns.map(c => c.propertyName);
    private readonly JOP_REQ  = this.SetRequestDateRepository.metadata.columns.map(c => c.propertyName);
    private readonly JOP_MAR_REQ = this.dataSource.getMetadata('JOP_MAR_REQ').columns.map(c => c.propertyName);
    private readonly JOP_PUR_CONF = this.dataSource.getMetadata('JOP_PUR_CONF').columns.map(c => c.propertyName);
    
    private readonly allowFields = [...this.JOBORDER, 'MAR_INPUTNAME', 'PUR_INPUTNAME', 'DeadLinePUR'];
    
    // private readonly JOP_REQ  = this.dataSource.getMetadata(SetRequestDate).columns.map(c => c.propertyName);
    // private readonly allowFields = [...this.JOBORDER, ...this.JOP_REQ, 'MAR_INPUTNAME', 'PUR_INPUTNAME', 'DeadLinePUR'];

    
    private readonly numberFields = ["REQUESTED_QTY" ,"ORDERED_QTY" ,"RECIEVE_QTY" ,"QTY" ,"ACTUALETA_AMEC" ,"LINENO" ,"VENDCODE" ,"PRNO" ,"PRDATE" ,"PONO" ,"PODATE" ,"DUEDATE", , 'JOP_REVISION', 'JOP_PONO', 'JOP_LINENO', 'JOP_PUR_STATUS', 'TURNOVER_STATUS'];

    private readonly dataFields = ["CUST_RQS", "DESSCH", "PRODSCH", "DESBMDATE", "MFGBMDATE", "EXPSHIP", 'JOP_MAR_REQUEST_DATE', 'JOP_MAR_INPUT_DATE', 'JOP_PUR_CONFIRM_DATE', 'JOP_PUR_INPUT_DATE'];


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
        const query = this.setQueryNew(dto);
        const { search = '', limit = 10, page = 1, fields = [] } = dto;

        if (search) {
            if (fields.length > 0) {
                const searchFields = getSafeFields(fields, [ 'PRNO', 'MFGNO', 'PRJ_NO', 'DRAWING', 'ITEM' ]);
                const [whereSql, whereParams] = this.getQueryFieldsBySelect(searchFields, this.numberFields, search);
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
            // data: mapAliasesToFields(data),
            data: await this.getRevisionHistory(data),
            recordsTotal: count, // key ที่ dataTable ต้องการ
            recordsFiltered: count, // key ที่ dataTable ต้องการ
            page,
            limit,
        }
    }



    private setQuery(dto: SearchOrderListDto, type : string = 'data') {
        const { fields = [], ORDTYPE, PRJ_NO, MFGNO, BUYEREMPNO, BUYERNAME, PRNO, PRDATE, PONO, PODATE, LINENO, VENDCODE, ITEM, DRAWING, INVOICE, DUEDATE } = dto;
        const query = this.OrderListRepository.createQueryBuilder('O');

        if (ORDTYPE)    query.andWhere('O.ORDTYPE = :ORDTYPE', { ORDTYPE });
        if (PRJ_NO)     query.andWhere('O.PRJ_NO = :PRJ_NO', { PRJ_NO });
        if (MFGNO)      query.andWhere('O.MFGNO = :MFGNO', { MFGNO });
        if (BUYEREMPNO) query.andWhere('O.BUYEREMPNO = :BUYEREMPNO', { BUYEREMPNO });
        if (BUYERNAME)  query.andWhere('O.BUYERNAME LIKE :BUYERNAME', { BUYERNAME: `%${BUYERNAME}%`});
        if (PRNO)       query.andWhere('O.PRNO = :PRNO', { PRNO });
        if (PRDATE)     query.andWhere('O.PRDATE = :PRDATE', { PRDATE });
        if (PONO)       query.andWhere('O.PONO = :PONO', { PONO });
        if (PODATE)     query.andWhere('O.PODATE = :PODATE', { PODATE });
        if (LINENO)     query.andWhere('O.LINENO = :LINENO', { LINENO });
        if (VENDCODE)   query.andWhere('O.VENDCODE = :VENDCODE', { VENDCODE });
        if (ITEM)       query.andWhere('O.ITEM LIKE :ITEM', { ITEM: `%${ITEM}%` });
        if (DRAWING)    query.andWhere('O.DRAWING LIKE :DRAWING', { DRAWING: `%${DRAWING}%` });
        if (INVOICE)    query.andWhere('O.INVOICE LIKE :INVOICE', { INVOICE: `%${INVOICE}%` });
        if (DUEDATE)    query.andWhere('O.DUEDATE = :DUEDATE', { DUEDATE });

        if (type === 'count') {
            return query;
        } else if (type === 'data') {
            if (fields.length > 0) {
                const safeFields = getSafeFields(fields, this.allowFields);
                query.select(safeFields.map(f => ['JOP_MAR_REQUEST_DATE','JOP_PUR_STATUS'].includes(f) ? `J.${f}` : `O.${f}`));
            }else{
                query.select(this.allowFields.map(f => ['JOP_MAR_REQUEST_DATE','JOP_PUR_STATUS'].includes(f) ? `J.${f}` : `O.${f}`));    
            }
            // query.leftJoinAndSelect('JOP_REQ', 'J', 'O.PRNO = J.JOP_PONO and O.LINENO = J.JOP_LINENO'); // จะ join และ select ให้ทั้งหมด
            query.leftJoin('JOP_REQ', 'J', 'O.PRNO = J.JOP_PONO and O.LINENO = J.JOP_LINENO and O.MFGNO = J.MFGNO'); //  join อย่างเดียวหากอยากได้ column ไหนต้อง select เอง
            query.leftJoin('AMECUSERALL', 'U', 'J.JOP_USERCREATE = U.SEMPNO');
            return query;
        }
    }

    private getQueryFieldsBySelect(fields: string[], numberFields: string[], search : string): [string, Record<string, string>] {
        const whereSqlParts: string[] = [];
        const whereParams: Record<string, string> = {};
        fields.forEach((field, idx) => {
            // เลือก TO_CHAR เฉพาะ field ที่เป็น number ถ้าต้องการ
            // ตรงนี้ขอยกตัวอย่างใช้ LIKE เฉย ๆ
            const param = `search${idx}`;
            // ถ้า field เป็น number ให้ใช้ TO_CHAR
            if (numberFields.includes(field)) {
                whereSqlParts.push(`TO_CHAR(OrderList.${field}) LIKE :${param}`);
            } else {
                whereSqlParts.push(`OrderList.${field} LIKE :${param}`);
            }
            whereParams[param] = `%${search}%`;
        });
        // รวมเป็น query string
        const whereSql = whereSqlParts.join(' OR ');

        return [whereSql, whereParams];
    }

    //  --------------------- new version 2025-07-04 ---------------------
     /**
     * Search for order lists
     * @param dto SearchOrderListDto
     * @returns 
     */
    async orderlistNew(dto: SearchOrderListDto) {
        // console.log('JOP_REQ', this.JOP_REQ);
        // console.log('allowFields', this.allowFields);
        
        // const jobOrder = this.OrderListRepository.metadata.columns.map(c => c.propertyName);
        // const jopReq = this.dataSource.getMetadata(SetRequestDate).columns.map(c => c.propertyName);
        // console.log('merge', [...jobOrder, ...jopReq]);
        // console.log('test2',this.OrderListRepository.metadata.columns.map(c => ({
        //     name: c.propertyName, // ชื่อ property (field ใน entity)
        //     type: c.type,         // type ที่กำหนดใน entity @ViewColumn({ type: 'varchar2' }) // หรือ 'varchar', 'nvarchar', ตาม type DB
        //     dbName: c.databaseName // ชื่อจริงใน database (optional)
        // })));

        const query = this.setQueryNew(dto);
        return await this.getRevisionHistory(await query.getRawMany());
    }

    
    async confirm(dto: SearchOrderListDto) {
        const query = this.setQueryNew(dto);
        // logQuery(query);
        query.andWhere('J.JOP_PUR_STATUS = :status', { status: 0 }); // 0 = ยังไม่ confirm
        const data = await query.getRawMany();
        return await this.getRevisionHistory(data);
        // return mapAliasesToFields(data);
    }

    async shipment(dto: SearchOrderListDto) {
        const query = this.setQueryNew(dto);
        // logQuery(query);
        query.andWhere('O.REQUESTED_QTY != O.RECIEVE_QTY'); // เงื่อนไขนี้จะเลือกเฉพาะรายการที่ยังไม่ได้รับสินค้าครบตามจำนวนที่สั่ง
        const data = await query.getRawMany();
        return await this.getRevisionHistory(data);
        // return mapAliasesToFields(data);
    }

    private setQueryNew(dto: SearchOrderListDto, type: string = 'data') {
        const { fields = [], ORDTYPE, PRJ_NO, MFGNO, BUYEREMPNO, BUYERNAME, PRNO, PRDATE, PONO, PODATE, LINENO, VENDCODE, ITEM, DRAWING, PARTNAME, INVOICE, DUEDATE, TURNOVER_STATUS, AGENT, SERIES, SDESSCH, SPRODSCH, SDESBMDATE, SMFGBMDATE, EDESSCH, EPRODSCH, EDESBMDATE, EMFGBMDATE, distinct, orderby, orderbyDirection, JOP_PUR_STATUS, JOP_PUR_INPUT_DATE, JOP_MAR_REQUEST, JOP_PUR_CONFIRM } = dto;

        const query = this.dataSource.createQueryBuilder().from('MV_JOB_ORDER','O');
        query.distinct(distinct == true); // เพื่อไม่ให้มีข้อมูลซ้ำ

        if(orderby) query.orderBy(orderby, orderbyDirection)

        // optional
        if (ORDTYPE)    query.andWhere('O.ORDTYPE = :ORDTYPE', { ORDTYPE });
        if (MFGNO)      query.andWhere('O.MFGNO = :MFGNO', { MFGNO });
        if (BUYEREMPNO) query.andWhere('O.BUYEREMPNO = :BUYEREMPNO', { BUYEREMPNO });
        if (BUYERNAME)  query.andWhere('O.BUYERNAME LIKE :BUYERNAME', { BUYERNAME: `%${BUYERNAME}%`});
        if (PRNO)       query.andWhere('O.PRNO = :PRNO', { PRNO });
        if (PRDATE)     query.andWhere('O.PRDATE = :PRDATE', { PRDATE });
        if (PONO)       query.andWhere('O.PONO = :PONO', { PONO });
        if (PODATE)     query.andWhere('O.PODATE = :PODATE', { PODATE });
        if (LINENO)     query.andWhere('O.LINENO = :LINENO', { LINENO });
        if (VENDCODE)   query.andWhere('O.VENDCODE = :VENDCODE', { VENDCODE });
        if (ITEM)       query.andWhere('O.ITEM LIKE :ITEM', { ITEM: `%${ITEM}%` });
        if (DRAWING)    query.andWhere('O.DRAWING LIKE :DRAWING', { DRAWING: `%${DRAWING}%` });
        if (PARTNAME)   query.andWhere('O.PARTNAME LIKE :PARTNAME', { PARTNAME: `%${PARTNAME}%` });
        if (INVOICE)    query.andWhere('O.INVOICE LIKE :INVOICE', { INVOICE: `%${INVOICE}%` });
        if (DUEDATE)    query.andWhere('O.DUEDATE = :DUEDATE', { DUEDATE });
        if (JOP_MAR_REQUEST)    query.andWhere('J.JOP_MAR_REQUEST = :JOP_MAR_REQUEST', { JOP_MAR_REQUEST });
        if (JOP_PUR_CONFIRM)    query.andWhere('J.JOP_PUR_CONFIRM = :JOP_PUR_CONFIRM', { JOP_PUR_CONFIRM });
        if (JOP_PUR_STATUS == 2){
            query.andWhere('J.JOP_PUR_STATUS IS NOT NULL');
        } else if (JOP_PUR_STATUS == 3) {
            query.andWhere('J.JOP_PUR_STATUS IS NULL');
        } else if (JOP_PUR_STATUS >= 0) {
            query.andWhere('J.JOP_PUR_STATUS = :JOP_PUR_STATUS', { JOP_PUR_STATUS });
        }   

        // search report 
        if (PRJ_NO)     query.andWhere('O.PRJ_NO LIKE :PRJ_NO', { PRJ_NO: `%${PRJ_NO}%` });
        if (AGENT)      query.andWhere('O.AGENT = :AGENT', { AGENT });
        if (SERIES)     query.andWhere('O.SERIES LIKE :SERIES', { SERIES: `%${SERIES}%` });
        if (SDESSCH && EDESSCH) {
            query.andWhere(`O.DESSCH >= TO_DATE(:SDESSCH, 'YYYY-MM-DD') AND O.DESSCH <= TO_DATE(:EDESSCH, 'YYYY-MM-DD')` , { SDESSCH, EDESSCH });
        }
        if (SPRODSCH && EPRODSCH) {
            query.andWhere(`O.PRODSCH >= TO_DATE(:SPRODSCH, 'YYYY-MM-DD') AND O.PRODSCH <= TO_DATE(:EPRODSCH, 'YYYY-MM-DD')` , { SPRODSCH, EPRODSCH });
        }
        if (SDESBMDATE && EDESBMDATE) {
            query.andWhere(`O.DESBMDATE >= TO_DATE(:SDESBMDATE, 'YYYY-MM-DD') AND O.DESBMDATE <= TO_DATE(:EDESBMDATE, 'YYYY-MM-DD')` , { SDESBMDATE, EDESBMDATE });
        }
        if (SMFGBMDATE && EMFGBMDATE) {
            query.andWhere(`O.MFGBMDATE >= TO_DATE(:SMFGBMDATE, 'YYYY-MM-DD') AND O.MFGBMDATE <= TO_DATE(:EMFGBMDATE, 'YYYY-MM-DD')` , { SMFGBMDATE, EMFGBMDATE });
        }

        if (JOP_PUR_INPUT_DATE) {
            query.andWhere(`TRUNC(J.JOP_PUR_INPUT_DATE) = TO_DATE(:JOP_PUR_INPUT_DATE, 'YYYY-MM-DD')` , { JOP_PUR_INPUT_DATE });
        }

        // all order, pending confirm, pending shipment
        if (TURNOVER_STATUS >= 0)    query.andWhere('O.TURNOVER_STATUS = :TURNOVER_STATUS', { TURNOVER_STATUS });
        
        if (type === 'count') {
            return query;
        } else if (type === 'data') {
            
            let select = [];
            if (fields.length > 0) {
                select = getSafeFields(fields, this.allowFields);
            }else{
                select = this.allowFields;
                query.select('JOP_MFGNO, JOP_PONO, JOP_LINENO, JOP_MAR_REVISION, JOP_PUR_STATUS, JOP_MAR_REQUEST, JOP_MAR_REQUEST_DATE, JOP_MAR_INPUT_DATE, JOP_MAR_REMARK, JOP_PUR_REVISION, JOP_PUR_CONFIRM, JOP_PUR_CONFIRM_DATE, JOP_PUR_INPUT_DATE, JOP_PUR_REMARK');
            }
            select.forEach((f)=>{
                // if (this.JOP_REQ.includes(f)) {
                //     query.addSelect(`J.${f}`, f);
                if ('MAR_INPUTNAME' === f) {
                    query.addSelect('U.SNAME', 'MAR_INPUTNAME');
                } else if ('PUR_INPUTNAME' === f) {
                    query.addSelect('I.SNAME', 'PUR_INPUTNAME');
                } else if ('DeadLinePUR' === f) {
                    query.addSelect("ADD_WORK_DAYS(TO_NUMBER(TO_CHAR(J.JOP_MAR_INPUT_DATE, 'YYYYMMDD')),7)", 'DeadLinePUR'); // เพื่อให้ได้ DeadLinePUR
                } else if ('PRJ_NO' === f) {
                    query.addSelect('O.PRJ_NO', 'PRJ_NO');
                    query.orderBy('O.PRJ_NO','ASC')
                } else {
                    query.addSelect(`O.${f}`, f);
                }
            })
            // query.leftJoinAndSelect('JOP_REQ', 'J', 'O.PRNO = J.JOP_PONO and O.LINENO = J.JOP_LINENO'); // จะ join และ select ให้ทั้งหมด
            // query.leftJoin('JOP_REQ', 'J', 'O.PRNO = J.JOP_PONO and O.LINENO = J.JOP_LINENO and O.MFGNO = J.JOP_MFGNO'); //  join อย่างเดียวหากอยากได้ column ไหนต้อง select เอง
            
            // ของ JOP_REQ ก่อนแยกตาราง
            // query.leftJoin(
            //     qb => qb
            //         .subQuery()
            //         .select("X.*")
            //         .from('JOP_REQ', 'X')
            //         .innerJoin(
            //             qb => qb
            //                 .subQuery()
            //                 .select('JOP_MFGNO, JOP_PONO, JOP_LINENO, MAX(JOP_REVISION) AS LAST_REVISION')
            //                 .from('JOP_REQ', 'J')
            //                 .groupBy('JOP_MFGNO, JOP_PONO, JOP_LINENO'),
            //                 'Y', // alias for subquery
            //                 'X.JOP_MFGNO = Y.JOP_MFGNO AND X.JOP_PONO = Y.JOP_PONO AND X.JOP_LINENO = Y.JOP_LINENO AND Y.LAST_REVISION = X.JOP_REVISION'
            //         ),
            //         'J', // alias for subquery
            //         'O.PRNO = J.JOP_PONO and O.LINENO = J.JOP_LINENO and O.MFGNO = J.JOP_MFGNO'
            // ); //  join อย่างเดียวหากอยากได้ column ไหนต้อง select เอง

            // หลังแยกตาราง
            query.leftJoin(
                qb => qb
                    .subQuery()
                    .select("X.JOP_MFGNO, X.JOP_PONO, X.JOP_LINENO, X.LAST_REVISION AS JOP_MAR_REVISION, JOP_PUR_STATUS, JOP_MAR_REQUEST, JOP_MAR_REQUEST_DATE, JOP_MAR_INPUT_DATE, JOP_MAR_REMARK, Y.LAST_REVISION AS JOP_PUR_REVISION, JOP_PUR_CONFIRM, JOP_PUR_CONFIRM_DATE, JOP_PUR_INPUT_DATE, JOP_PUR_REMARK")
                    .from(
                        qb => qb
                            .subQuery()
                            .select('A.JOP_MFGNO, A.JOP_PONO, A.JOP_LINENO, LAST_REVISION, JOP_PUR_STATUS, JOP_MAR_REQUEST, JOP_MAR_REQUEST_DATE, JOP_MAR_INPUT_DATE, JOP_MAR_REMARK')
                            .from('JOP_MAR_REQ', 'A')
                            .innerJoin(
                                qb => qb
                                    .subQuery()
                                    .select('JOP_MFGNO, JOP_PONO, JOP_LINENO, MAX(JOP_REVISION) AS LAST_REVISION')
                                    .from('JOP_MAR_REQ', 'MAR')
                                    .groupBy('JOP_MFGNO, JOP_PONO, JOP_LINENO'),
                                    'B',
                                    'A.JOP_MFGNO = B.JOP_MFGNO AND A.JOP_PONO = B.JOP_PONO AND A.JOP_LINENO = B.JOP_LINENO AND B.LAST_REVISION = A.JOP_REVISION'
                            ),
                            'X',
                    )
                    .leftJoin(
                        qb => qb
                            .subQuery()
                            .select('C.JOP_MFGNO, C.JOP_PONO, C.JOP_LINENO, LAST_REVISION, JOP_PUR_CONFIRM, JOP_PUR_CONFIRM_DATE, JOP_PUR_INPUT_DATE, JOP_PUR_REMARK')
                            .from('JOP_PUR_CONF', 'C')
                            .innerJoin(
                                qb => qb
                                    .subQuery()
                                    .select('JOP_MFGNO, JOP_PONO, JOP_LINENO, MAX(JOP_REVISION) AS LAST_REVISION')
                                    .from('JOP_PUR_CONF', 'PUR')
                                    .groupBy('JOP_MFGNO, JOP_PONO, JOP_LINENO'),
                                    'D',
                                    'C.JOP_MFGNO = D.JOP_MFGNO AND C.JOP_PONO = D.JOP_PONO AND C.JOP_LINENO = D.JOP_LINENO AND D.LAST_REVISION = C.JOP_REVISION'
                            ),
                            'Y',
                            'X.JOP_MFGNO = Y.JOP_MFGNO AND X.JOP_PONO = Y.JOP_PONO AND X.JOP_LINENO = Y.JOP_LINENO'
                    )
                    ,'J',
                    'O.PRNO = J.JOP_PONO and O.LINENO = J.JOP_LINENO and O.MFGNO = J.JOP_MFGNO'
            );
            // query.leftJoin('AMECUSERALL', 'U', 'J.JOP_MAR_REQUEST = U.SEMPNO');
            // query.leftJoin('AMECUSERALL', 'I', 'J.JOP_PUR_CONFIRM = I.SEMPNO');
            query.leftJoin('AMECUSERALL', 'U', 'J.JOP_MAR_REQUEST = U.SEMPNO');
            query.leftJoin('AMECUSERALL', 'I', 'J.JOP_PUR_CONFIRM = I.SEMPNO');
            return query;
        }
    }


    async getRevisionHistory(list: any[]): Promise<any[]> {
        for (const l of list) {
          // console.log(l.JOP_MFGNO);
          // l.REVISION = [];
          if (l.JOP_MAR_REVISION) {
            const revision = await this.JopMarReqService.getRevisionHistory(
              l.JOP_MFGNO,
              l.JOP_PONO,
              l.JOP_LINENO,
            );
            l.MAR_REVISION = revision.map((r) => {
              r.JOP_REVISION_TEXT = numberToAlphabetRevision(r.JOP_REVISION);
              return {
                REVISION: r.JOP_REVISION,
                REVISION_TEXT: r.JOP_REVISION_TEXT,
                ACTION_BY: r.JOP_MAR_REQUEST,
                DATE: r.JOP_MAR_REQUEST_DATE,
                REMARK: r.JOP_MAR_REMARK,
                INPUT_DATE: r.JOP_MAR_INPUT_DATE,
                NAME: r.marRequest.SNAME,
              };
            });
          }
          if (l.JOP_PUR_REVISION) {
            const purRevision = await this.JopPurConfService.getRevisionHistory(
              l.JOP_MFGNO,
              l.JOP_PONO,
              l.JOP_LINENO,
            );
            l.PUR_REVISION = purRevision.map((r) => {
              r.JOP_REVISION_TEXT = numberToAlphabetRevision(r.JOP_REVISION);
              return {
                REVISION: r.JOP_REVISION,
                REVISION_TEXT: r.JOP_REVISION_TEXT,
                ACTION_BY: r.JOP_PUR_CONFIRM,
                DATE: r.JOP_PUR_CONFIRM_DATE,
                REMARK: r.JOP_PUR_REMARK,
                INPUT_DATE: r.JOP_PUR_INPUT_DATE,
                NAME: r.purConfirm.SNAME,
              };
            });
          }
        }
        return list;
      }
}


