import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpecialuserService } from '../specialuser/specialuser.service';

import { searchDblogs } from './dto/search.dto';
import { AMECLog } from './entities/amec.entity';
import { ISOLog } from './entities/iso.entity';
import { LnLog } from './entities/ln.entity';
import { SCMLog } from './entities/scm.entity';
import { Windows } from '../oslogs/entities/windows.entity';
import { formatDate } from 'src/common/utils/dayjs.utils';

@Injectable()
export class DblogsService {
  constructor(
    @InjectRepository(AMECLog, 'auditConnection')
    private readonly amec: Repository<AMECLog>,
    @InjectRepository(ISOLog, 'auditConnection')
    private readonly iso: Repository<ISOLog>,
    @InjectRepository(LnLog, 'auditConnection')
    private readonly ln: Repository<LnLog>,
    @InjectRepository(SCMLog, 'auditConnection')
    private readonly scm: Repository<SCMLog>,
    @InjectRepository(Windows, 'auditConnection')
    private readonly as400: Repository<Windows>,

    private readonly users: SpecialuserService,
  ) {}

  async search(data: searchDblogs) {
    const { query, server, startDate, endDate, users } = data;
    let queryBuilder;
    switch (server) {
      case 'AMECDB2':
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
      'LOG_DATE, LOG_TIME, LOG_SERVER, LOG_USER, LOG_DOMAIN, LOG_HOST, LOG_IP, LOG_MSG',
    );

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
    const results = await queryBuilder.getRawMany();
    const dbusers = await this.users.getAll();
    switch (users) {
      case '2':
        //System
        const systemLogins = dbusers.filter(
          (user) =>
            user.SERVER_NAME == server &&
            user.CATEGORY == 'DB' &&
            user.USER_TYPE2 == 'System',
        );
        return results.filter((log) =>
          systemLogins.some((user) => user.USER_LOGIN === log.LOG_USER),
        );
      case '3':
        //Humnan
        const humanLogins = dbusers.filter(
          (user) =>
            user.SERVER_NAME == server &&
            user.CATEGORY == 'DB' &&
            user.USER_TYPE2 == 'Human',
        );
        return results.filter((log) =>
          humanLogins.some((user) => user.USER_LOGIN === log.LOG_USER),
        );
      case '4':
        //Special
        const specialLogins = dbusers.filter(
          (user) =>
            user.SERVER_NAME == server &&
            user.CATEGORY == 'DB' &&
            user.USER_TYPE2 == 'Human' &&
            user.USER_TYPE1 == 'Temporary',
        );
        return results.filter((log) =>
          specialLogins.some((user) => user.USER_LOGIN === log.LOG_USER),
        );
      case '5':
        //Unknown
        const knownLogins = dbusers.filter(
          (user) => user.SERVER_NAME == server && user.CATEGORY == 'DB',
        );
        return results.filter(
          (log) =>
            !knownLogins.some((user) => user.USER_LOGIN === log.LOG_USER),
        );
      default:
        if (server == 'AS400') {
          const as400Logins = dbusers.filter(
            (user) => user.SERVER_NAME == server && user.CATEGORY == 'DB',
          );
          return results.filter((log) =>
            as400Logins.some((user) => user.USER_LOGIN === log.LOG_USER),
          );
        }
        return results;
    }
  }
}
