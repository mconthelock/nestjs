import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { formatDate } from 'src/common/utils/dayjs.utils';

import { WSDTaskLog } from '../../common/Entities/docinv/views/wsdtasklog.entity';
import { AASTaskLog } from '../../common/Entities/docinv/views/aastasklog.entity';

import { searchTasklogs } from './dto/search.dto';
import { updateTasklogs } from './dto/update.dto';

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
            if (startDate) {
                queryBuilder.andWhere('logs.LOG_DATE >= :startDate', {
                    startDate: formatDate(startDate),
                });
            }

            if (endDate) {
                queryBuilder.andWhere('logs.LOG_DATE <= :endDate', {
                    endDate: formatDate(endDate),
                });
            }
        } else if (server === 'AAS') {
            queryBuilder = this.aas.createQueryBuilder('logs');
            if (startDate) {
                queryBuilder.andWhere(
                    "logs.LOG_DATE >= TO_DATE(:startDate, 'YYYY-MM-DD')",
                    {
                        startDate: formatDate(startDate),
                    },
                );
            }

            if (endDate) {
                queryBuilder.andWhere(
                    "logs.LOG_DATE <= TO_DATE(:endDate, 'YYYY-MM-DD')",
                    {
                        endDate: formatDate(endDate),
                    },
                );
            }
        }

        if (status) {
            queryBuilder.andWhere('logs.JOBSTATUS = :status', { status });
        }
        return await queryBuilder.getMany();
    }
}
