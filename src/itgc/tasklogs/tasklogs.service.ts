import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { formatDate } from 'src/common/utils/dayjs.utils';

import { WSDTaskLog } from './entities/wsd.entity';
import { AASTaskLog } from './entities/aas.entity';
import { TaskLogs } from './entities/tasklogs.entity';

import { searchTasklogs } from './dto/search.dto';
import { updateTasklogs } from './dto/update.dto';

@Injectable()
export class TasklogsService {
    constructor(
        @InjectRepository(WSDTaskLog, 'auditConnection')
        private readonly wsd: Repository<WSDTaskLog>,

        @InjectRepository(AASTaskLog, 'docinvConnection')
        private readonly aas: Repository<AASTaskLog>,

        @InjectRepository(TaskLogs, 'webformConnection')
        private readonly tsk: Repository<TaskLogs>,
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

    async saveAction(dto: updateTasklogs) {
        const data = this.tsk.findOne({
            where: {
                RC_SECTION: dto.RC_SECTION,
                RC_DATETIME: dto.RC_DATETIME,
                RC_JOBNO: dto.RC_JOBNO,
            },
        });
        if (data) {
            await this.tsk.update(
                {
                    RC_SECTION: dto.RC_SECTION,
                    RC_DATETIME: dto.RC_DATETIME,
                    RC_JOBNO: dto.RC_JOBNO,
                },
                dto,
            );
        } else {
            await this.tsk.save(dto);
        }
        return { message: 'Action saved successfully' };
    }
}
