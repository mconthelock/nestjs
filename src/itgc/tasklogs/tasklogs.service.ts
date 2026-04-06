import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WSDTaskLog } from './entities/wsd.entity';
import { AASTaskLog } from './entities/aas.entity';
import { searchTasklogs } from './dto/search.dto';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

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
            await applyDynamicFilters(
                queryBuilder,
                { START_LOG_DATE: startDate },
                'logs',
            );
        }

        if (endDate) {
            await applyDynamicFilters(
                queryBuilder,
                { START_LOG_DATE: startDate },
                'logs',
            );
        }

        if (status) {
            queryBuilder.andWhere('logs.JOBSTATUS = :status', { status });
        }
        return await queryBuilder.getMany();
    }
}
