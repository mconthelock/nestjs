import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Raw, DataSource } from 'typeorm';
import { SearchOrdermainDto } from './dto/search-ordermain.dto';
import { Ordermain } from './entities/ordermain.entity';

@Injectable()
export class OrdermainService {
  constructor(
    @InjectRepository(Ordermain, 'amecConnection')
    private readonly ords: Repository<Ordermain>,
    @InjectDataSource('amecConnection')
    private readonly ds: DataSource
  ) {}

  async search(req: SearchOrdermainDto) {
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
  async sproj(req: SearchOrdermainDto) {
    const where = {};
    if (req.PRJ_NO) where['PRJ_NO'] = req.PRJ_NO;
    return await this.ds.createQueryBuilder()
    .from('TMARKET_TEMP', 'A')
    .leftJoin('TMAINTAINTYPE', 'B', 'SERIES = ABBREVIATION')
    .select('prj_no, prj_name, spec, DETAIL AS MODEL ')
    .addSelect(' max(cust_rqs) ', 'EXPPLAN')
    .addSelect(' sum(QTY)', 'TOTUNIT')
    .where("PRJ_NO = :req", {req:req.PRJ_NO})
    .andWhere("revision_code <> 'D'")
    .groupBy('PRJ_NO , PRJ_NAME , SPEC , DETAIL')
    .getRawMany();
  }
}
