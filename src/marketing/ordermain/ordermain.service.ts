import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Raw } from 'typeorm';
import { SearchOrdermainDto } from './dto/search-ordermain.dto';
import { Ordermain } from './entities/ordermain.entity';

@Injectable()
export class OrdermainService {
  constructor(
    @InjectRepository(Ordermain, 'amecConnection')
    private readonly ords: Repository<Ordermain>,
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
    return await this.ords.find({ where: where });
  }
}
