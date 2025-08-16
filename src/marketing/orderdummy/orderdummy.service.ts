import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Raw } from 'typeorm';
import { SearchOrderdummyDto } from './dto/search-orderdummy.dto';
import { Orderdummy } from './entities/orderdummy.entity';

@Injectable()
export class OrderdummyService {
  constructor(
    @InjectRepository(Orderdummy, 'amecConnection')
    private readonly ords: Repository<Orderdummy>,
  ) {}

  async search(req: SearchOrderdummyDto) {
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
}
