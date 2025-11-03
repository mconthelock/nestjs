import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WSDTaskLog } from './entities/wsd.entity';
import { AASTaskLog } from './entities/aas.entity';
import { searchTasklogs } from './dto/search.dto';

@Injectable()
export class TasklogsService {
  constructor(
    @InjectRepository(WSDTaskLog, 'auditConnection')
    private readonly wsd: Repository<WSDTaskLog>,

    @InjectRepository(AASTaskLog, 'docinvConnection')
    private readonly aas: Repository<AASTaskLog>,
  ) {}

  async search(data: searchTasklogs) {
    const { query, server, startDate, endDate, status } = data;
    let queryBuilder;
    if (server === 'WSD') {
      queryBuilder = this.wsd.createQueryBuilder('logs');
    } else if (server === 'AAS') {
      queryBuilder = this.aas.createQueryBuilder('logs');
    }

    if (startDate) {
      queryBuilder.andWhere('logs.LOG_DATE >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('logs.LOG_DATE <= :endDate', { endDate });
    }

    if (status) {
      queryBuilder.andWhere('logs.JOBSTATUS = :status', { status });
    }
    return await queryBuilder.getMany();
  }
}
