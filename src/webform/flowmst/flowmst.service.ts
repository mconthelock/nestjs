import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Flowmst } from './entities/flowmst.entity';
import { Flowmstts } from './entities/flowmstts.entity';
import { setRepo } from 'src/utils/repo';
import { table } from 'console';

@Injectable()
export class FlowmstService {
  constructor(
    @InjectRepository(Flowmst, 'amecConnection')
    private readonly flowmstRepo: Repository<Flowmst>,
    @InjectRepository(Flowmstts, 'amecConnection')
    private readonly flowmsttsRepo: Repository<Flowmstts>,
  ) {}

  getFlowMasterAll(host: string) {
    const repo = setRepo(this.flowmstRepo, this.flowmsttsRepo, host);
    return repo.find();
  }

  async getFlowMaster(
    NFRMNO: number,
    VORGNO: string,
    CYEAR: string,
    host: string,
  ) {
    const repo = setRepo(this.flowmstRepo, this.flowmsttsRepo, host);
    const tableName = repo.metadata.tableName;
    const sql = `
        SELECT TO_CHAR(NFRMNO) AS NFRMNO, A.*
        FROM ${tableName} A
        START WITH NFRMNO = :NFRMNO
            AND vOrgNo = :VORGNO
            AND cYear = :CYEAR
            AND cStart = '1'
        CONNECT BY NFRMNO = :NFRMNO2
            AND vOrgNo = :VORGNO2
            AND cYear = :CYEAR2
            AND cStepNo = PRIOR cStepNextNo
        `;
    return await repo.query(sql, {
      NFRMNO,
      VORGNO,
      CYEAR,
      NFRMNO2: NFRMNO,
      VORGNO2: VORGNO,
      CYEAR2: CYEAR,
    });
    // return repo.find({ where: { NFRMNO, VORGNO, CYEAR } });
  }
}
