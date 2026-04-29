import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialuserService } from '../specialuser/specialuser.service';

import { searchApplogs } from './dto/search.dto';
import { formatDate } from 'src/common/utils/dayjs.utils';

import { AmecappLog } from 'src/common/Entities/itgc/views/amecapp.entity';
import { As400appLog } from 'src/common/Entities/itgc/views/as400app.entity';
import { InvoiceAppLog } from 'src/common/Entities/itgc/views/invoiceapp.entity';
import { MarketingAppLog } from 'src/common/Entities/itgc/views/mktapp.entity';
import { ScmappLog } from 'src/common/Entities/itgc/views/scmapp.entity';

@Injectable()
export class ApplogsService {
    constructor(
        @InjectRepository(AmecappLog, 'auditConnection')
        private readonly amec: Repository<AmecappLog>,

        @InjectRepository(InvoiceAppLog, 'auditConnection')
        private readonly iso: Repository<InvoiceAppLog>,

        @InjectRepository(MarketingAppLog, 'auditConnection')
        private readonly marketing: Repository<MarketingAppLog>,

        @InjectRepository(ScmappLog, 'auditConnection')
        private readonly scm: Repository<ScmappLog>,

        @InjectRepository(As400appLog, 'auditConnection')
        private readonly as400: Repository<As400appLog>,

        private readonly users: SpecialuserService,
    ) {}

    async search(data: searchApplogs) {
        const { query, server, startDate, endDate, users, status } = data;
        let queryBuilder;
        switch (server) {
            case 'WEBFLOW':
                queryBuilder = this.amec.createQueryBuilder('logs');
                break;
            case 'SCMWEB':
                queryBuilder = this.scm.createQueryBuilder('logs');
                break;
            case 'AS400':
                queryBuilder = this.as400.createQueryBuilder('logs');
                break;
            default:
                queryBuilder = this.iso.createQueryBuilder('logs');
                queryBuilder.andWhere('logs.LOG_DOMAIN = :server', { server });
                break;
        }

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

        if (status) {
            queryBuilder.andWhere('logs.LOG_LOGIN_STATUS = :status', {
                status,
            });
        }

        const results = await queryBuilder.getRawMany();
        const appusers = await this.users.getAll();
        if (users == '2') {
            const appname = ['Invoice', 'Marketing'].includes(server)
                ? 'AMECISODB'
                : server;
            const systemLogins = appusers.filter(
                (user) => user.SERVER_NAME == appname && user.CATEGORY == 'APP',
            );
            return results.filter((log) =>
                systemLogins.some((user) => user.USER_LOGIN === log.LOG_USER),
            );
        } else {
            if (server == 'AS400') {
                const as400Logins = appusers.filter(
                    (user) =>
                        user.SERVER_NAME == server && user.CATEGORY == 'APP',
                );
                return results.filter((log) =>
                    as400Logins.some(
                        (user) => user.USER_LOGIN === log.LOG_USER,
                    ),
                );
            }
            return results;
        }
    }
}
