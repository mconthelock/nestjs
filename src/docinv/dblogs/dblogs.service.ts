import * as dayjsModule from 'dayjs';
const dayjs = (dayjsModule as any).default ?? (dayjsModule as any);
import * as utcModule from 'dayjs/plugin/utc';
import * as timezoneModule from 'dayjs/plugin/timezone';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialuserService } from '../specialuser/specialuser.service';
import { searchDblogs } from './dto/search.dto';

import { Amecdblog } from 'src/common/Entities/docinv/views/amecdb.entity';
import { IsodbLog } from 'src/common/Entities/docinv/views/isodb.entity';
import { LndbLog } from 'src/common/Entities/docinv/views/lndb.entity';
import { scmdbLog } from 'src/common/Entities/docinv/views/scmdb.entity';
import { AS400dbLog } from 'src/common/Entities/docinv/views/as400db.entrity';

const utc = (utcModule as any).default ?? (utcModule as any);
const timezone = (timezoneModule as any).default ?? (timezoneModule as any);
dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class DblogsService {
    constructor(
        @InjectRepository(Amecdblog, 'docinvConnection')
        private readonly amec: Repository<Amecdblog>,

        @InjectRepository(IsodbLog, 'auditConnection')
        private readonly iso: Repository<IsodbLog>,

        @InjectRepository(LndbLog, 'lnConnection')
        private readonly ln: Repository<LndbLog>,

        @InjectRepository(scmdbLog, 'auditConnection')
        private readonly scm: Repository<scmdbLog>,

        @InjectRepository(AS400dbLog, 'auditConnection')
        private readonly as400: Repository<AS400dbLog>,

        private readonly users: SpecialuserService,
    ) {}

    async search(data: searchDblogs) {
        const { query, server, startDate, endDate, users } = data;
        let queryBuilder;
        switch (server) {
            case 'AMECDB3':
                queryBuilder = this.amec.createQueryBuilder('logs');
                break;
            case 'FIN-LN-DB':
                queryBuilder = this.ln.createQueryBuilder('logs');
                break;
            case 'SCMDB':
                queryBuilder = this.scm.createQueryBuilder('logs');
                break;
            case 'AS400':
                queryBuilder = this.as400.createQueryBuilder('logs');
                queryBuilder.andWhere('logs.LOG_SERVER = :server', { server });
                break;
            default:
                queryBuilder = this.iso.createQueryBuilder('logs');
        }
        queryBuilder.select(
            `LOG_DATE, LOG_TIME, LOG_SERVER, LOG_USER, LOG_DOMAIN, LOG_HOST, LOG_IP, LOG_MSG`,
        );

        if (startDate) {
            const startOfDayBangkok = dayjs(startDate)
                .tz('Asia/Bangkok')
                .startOf('day');
            queryBuilder.andWhere('logs.LOG_DATE >= :startDate', {
                startDate: startOfDayBangkok.toDate(),
            });
        }

        if (endDate) {
            const endOfRangeBangkok = dayjs(endDate)
                .tz('Asia/Bangkok')
                .startOf('day')
                .add(1, 'day');
            queryBuilder.andWhere('logs.LOG_DATE < :endDate', {
                endDate: endOfRangeBangkok.toDate(),
            });
        }
        const results = await queryBuilder.getRawMany();
        const dbusers = await this.users.getAll();
        switch (users) {
            //System
            case '2':
                const systemLogins = dbusers.filter(
                    (user) =>
                        user.SERVER_NAME == server &&
                        user.CATEGORY == 'DB' &&
                        user.USER_TYPE2 == 'System',
                );
                return results.filter((log) =>
                    systemLogins.some(
                        (user) => user.USER_LOGIN === log.LOG_USER,
                    ),
                );
            //Humnan
            case '3':
                const humanLogins = dbusers.filter(
                    (user) =>
                        user.SERVER_NAME == server &&
                        user.CATEGORY == 'DB' &&
                        user.USER_TYPE2 == 'Human',
                );
                return results.filter((log) =>
                    humanLogins.some(
                        (user) => user.USER_LOGIN === log.LOG_USER,
                    ),
                );
            //Special
            case '4':
                const specialLogins = dbusers.filter(
                    (user) =>
                        user.SERVER_NAME == server &&
                        user.CATEGORY == 'DB' &&
                        user.USER_TYPE2 == 'Human' &&
                        user.USER_TYPE1 == 'Temporary',
                );
                return results.filter((log) =>
                    specialLogins.some(
                        (user) => user.USER_LOGIN === log.LOG_USER,
                    ),
                );
            //Unknown
            case '5':
                const knownLogins = dbusers.filter(
                    (user) =>
                        user.SERVER_NAME == server && user.CATEGORY == 'DB',
                );
                return results.filter(
                    (log) =>
                        !knownLogins.some(
                            (user) => user.USER_LOGIN === log.LOG_USER,
                        ),
                );
            default:
                if (server == 'AS400') {
                    const as400Logins = dbusers.filter(
                        (user) =>
                            user.SERVER_NAME == server && user.CATEGORY == 'DB',
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
