import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw, DataSource } from 'typeorm';
import { SearchOrderpartDto } from './dto/search-orderpart.dto';
import { Orderpart } from './entities/orderpart.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class OrderpartsService {
  constructor(
    @InjectRepository(Orderpart, 'amecConnection')
    private readonly ords: Repository<Orderpart>,

    @InjectDataSource('spsysConnection')
    private readonly sp: DataSource,
  ) {}

  async search(req: SearchOrderpartDto) {
    const where = {};
    if (req.SERIES) where['SERIES'] = req.SERIES;
    if (req.AGENT) where['AGENT'] = req.AGENT;
    if (req.PRJ_NO) where['PRJ_NO'] = req.PRJ_NO;
    if (req.ORDER_NO) where['ORDER_NO'] = req.ORDER_NO;
    if (req.MFGNO) where['MFGNO'] = req.MFGNO;
    if (req.CAR_NO) {
      const trimmedCarNo = req.CAR_NO.trim(); // Trim ค่าจาก input ด้วย
      where['CAR_NO'] = Raw(
        (columnAlias) => `TRIM(${columnAlias}) = :trimmedCarNo`,
        { trimmedCarNo },
      );
    }

    if (req.SMFGNO) {
      const trimmedMfgNo = req.SMFGNO.trim();
      where['MFGNO'] = Raw((columnAlias) => `MFGNO LIKE '%${trimmedMfgNo}%'`, {
        trimmedMfgNo,
      });
    }
    return await this.ords.find({ where: where });
  }

  async searchSP(req: any) {
    console.log(req);

    const query = this.sp
      .createQueryBuilder()
      .select(
        "INQ_NO, INQ_TRADER, METHOD_DESC, IDS_DATE, CREATEBY, TRADER, PRJ_NO, PRJ_NAME, MFGNO, CAR_NO, AGENT, DSTN, AMEC_SCHDL, CUST_RQS, CASE WHEN INQ_TRADER = 'Direct' THEN 'STOCK PART' ELSE INQ_TRADER||'/' END AS SHIP, PT, MARREQPRDN, REMARK, P_O_AMOUNT, CSQTY, PCATE_NAME, C.*",
      )
      .from('SP_INQUIRY', 'A')
      .innerJoin('SP_METHOD', 'B', 'A.INQ_DELIVERY_METHOD = B.METHOD_ID')
      .innerJoin(
        'SP_INQUIRY_DETAIL',
        'C',
        'A.INQ_ID = C.INQID AND INQD_LATEST = 1',
      )
      .leftJoin(
        'TMARKET_TEMP_PARTS',
        'D',
        "A.INQ_NO = D.INQUIRY_NO AND REVISION_CODE != 'D'",
      )
      .leftJoin(
        'SPCALSHEET_DETAIL_QTY',
        'E',
        'E.ORDNO = D.ORDER_NO AND E.ELVNO = D.ELV_NO AND E.INQNO = A.INQ_NO  AND E.CSSEQ = C.INQD_SEQ',
      )
      .innerJoin('MS_PARTS_CATEGORY', 'F', 'D.PART_CATEGORY = F.PCATE_CODE')
      .where('INQ_LATEST = 1');
    //   .andWhere("INQ_DATE >= to_date(:startDate, 'YYYYMMDD')", {
    //     startDate: '20251001',
    //   });

    if (req) {
      const date_list = ['SINQ_DATE', 'EINQ_DATE', 'SIDS_DATE', 'EIDS_DATE'];
      const like_list = ['MFGNO', 'CAR_NO'];
      for (const key in req) {
        if (date_list.includes(key)) {
          const dateKey = key.substring(1); // Remove first char (S or E)
          query.andWhere(
            `${dateKey} ${key.startsWith('S') ? '>=' : '<='} to_date(:${key}, 'YYYYMMDD')`,
            {
              [key]: dayjs(req[key]).format('YYYYMMDD'),
            },
          );
          continue;
        }

        if (like_list.includes(key)) {
          const trimmedValue = req[key].trim();
          query.andWhere(`${key} LIKE :${key}`, {
            [key]: `%${trimmedValue}%`,
          });
          continue;
        }

        // if (req.IS_ORDERS != undefined) {
        //   query.andWhere('E.INQNO IS NOT NULL');
        //   continue;
        // }

        if (key == 'IS_ORDERS') {
          query.andWhere('E.INQNO IS NOT NULL');
          continue;
        }

        const trimmedValue = req[key].trim();
        query.andWhere(`${key} = :${key}`, { [key]: trimmedValue });
      }
    }
    return await query.getRawMany();
  }
}
