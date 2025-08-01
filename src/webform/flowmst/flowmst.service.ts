import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Flowmst } from './entities/flowmst.entity';

@Injectable()
export class FlowmstService {
  constructor(
    @InjectRepository(Flowmst, 'amecConnection')
    private readonly flowmstRepo: Repository<Flowmst>,
  ) {}

  getFlowMasterAll() {
    return this.flowmstRepo.find();
  }

  async getFlowMaster(
    NFRMNO: number,
    VORGNO: string,
    CYEAR: string
  ) {
    const sql = `
        SELECT TO_CHAR(NFRMNO) AS NFRMNO, A.*
        FROM FLOWMST A
        START WITH NFRMNO = :1
            AND vOrgNo = :2
            AND cYear = :3
            AND cStart = '1'
        CONNECT BY NFRMNO = :4
            AND vOrgNo = :5
            AND cYear = :6
            AND cStepNo = PRIOR cStepNextNo
        `;
    return await this.flowmstRepo.query(
      sql,
      [NFRMNO, VORGNO, CYEAR, NFRMNO, VORGNO, CYEAR]
    );
    // return repo.find({ where: { NFRMNO, VORGNO, CYEAR } });
  }
}
