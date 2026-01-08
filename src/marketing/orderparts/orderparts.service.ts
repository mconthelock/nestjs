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

  async searchSP(req: SearchOrderpartDto) {
    return await this.sp
      .createQueryBuilder()
      .from('TMARKET_TEMP_PARTS', 'A')
      .leftJoin('MS_PARTS_CATEGORY', 'B', 'A.PART_CATEGORY = B.PCATE_CODE')
      .innerJoin(
        'SP_INQUIRY',
        'C',
        'A.INQUIRY_NO = C.INQ_NO AND C.INQ_LATEST = 1',
      )
      .select(
        'IDS_DATE, TRADER, PCATE_NAME, PRJ_NO, AGENT, DSTN, INQUIRY_NO, CUST_RQS, CREATEBY, RECON_PARTS, TRADER',
      )
      .distinct(true)
      //.where('ORDER_NO = :req', { req: req.ORDER_NO })
      .where('RECON_PARTS = 0')
      .andWhere('INQUIRY_NO IS NOT NULL')
      .andWhere("revision_code <> 'D'")
      .andWhere(
        `IDS_DATE >= to_date('${dayjs().subtract(6, 'month').format('YYYYMMDD')}','YYYYMMDD')`,
      )
      .getRawMany();
  }
}
