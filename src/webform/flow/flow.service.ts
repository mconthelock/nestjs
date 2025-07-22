import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { Flow } from './entities/flow.entity';
import { Flowts } from './entities/flowts.entity';

import { getExtDataDto } from './dto/get-Extdata.dto';
import { setRepo } from 'src/utils/repo'

@Injectable()
export class FlowService {
  constructor(
    @InjectRepository(Flow, 'amecConnection')
    private readonly flowRepo: Repository<Flow>,
    @InjectRepository(Flowts, 'amecConnection')
    private readonly flowtsRepo: Repository<Flowts>,
  ) {}
  private readonly STEP_READY = "3";

  getExtData(dto: getExtDataDto, host: string) {
    const repo = setRepo(this.flowRepo, this.flowtsRepo, host);
    const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, APV } = dto;

    return repo
      .createQueryBuilder('f')
      .select('CEXTDATA')
      .where('f.NFRMNO = :NFRMNO', { NFRMNO })
      .andWhere('f.VORGNO = :VORGNO', { VORGNO })
      .andWhere('f.CYEAR = :CYEAR', { CYEAR })
      .andWhere('f.CYEAR2 = :CYEAR2', { CYEAR2 })
      .andWhere('f.NRUNNO = :NRUNNO', { NRUNNO })
      .andWhere('(f.VAPVNO = :APV OR f.VREPNO = :REP)', { APV, REP: APV })
      .andWhere('f.CSTEPST = :STEP_READY', { STEP_READY: '3' })
      .getRawMany();
  }
}
