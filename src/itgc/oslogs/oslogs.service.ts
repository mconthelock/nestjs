import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Windows } from './entities/windows.entity';
import { searchOslogs } from './dto/search.dto';
import { SpecialuserService } from '../specialuser/specialuser.service';

@Injectable()
export class OslogsService {
  constructor(
    @InjectRepository(Windows, 'auditConnection')
    private readonly winos: Repository<Windows>,
    private readonly users: SpecialuserService,
  ) {}

  async searchOslogs(data: searchOslogs) {
    const { query, server, startDate, endDate, users } = data;
    const queryBuilder = this.winos.createQueryBuilder('windows');
    if (query) {
      queryBuilder.andWhere('windows.query LIKE :query', {
        query: `%${query}%`,
      });
    }

    if (server) {
      queryBuilder.andWhere('windows.LOG_SERVER = :server', { server });
    }

    if (startDate) {
      queryBuilder.andWhere('windows.LOG_DATE >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('windows.LOG_DATE <= :endDate', { endDate });
    }
    const results = await queryBuilder.getMany();

    const osusers = await this.users.getAll();
    //All users
    switch (users) {
      case '2':
        //System
        const systemLogins = osusers.filter(
          (user) =>
            user.SERVER_NAME == server &&
            user.CATEGORY == 'OS' &&
            user.USER_TYPE2 == 'System',
        );
        return results.filter((log) =>
          systemLogins.some((user) => user.USER_LOGIN === log.LOG_USER),
        );
      case '3':
        //Humnan
        const humanLogins = osusers.filter(
          (user) =>
            user.SERVER_NAME == server &&
            user.CATEGORY == 'OS' &&
            user.USER_TYPE2 == 'Human',
        );
        return results.filter((log) =>
          humanLogins.some((user) => user.USER_LOGIN === log.LOG_USER),
        );
      case '4':
        //Special
        const specialLogins = osusers.filter(
          (user) =>
            user.SERVER_NAME == server &&
            user.CATEGORY == 'OS' &&
            user.USER_TYPE2 == 'Human' &&
            user.USER_TYPE1 == 'Temporary',
        );
        return results.filter((log) =>
          specialLogins.some((user) => user.USER_LOGIN === log.LOG_USER),
        );
      case '5':
        //Unknown
        const knownLogins = osusers.filter(
          (user) => user.SERVER_NAME == server && user.CATEGORY == 'OS',
        );
        return results.filter(
          (log) =>
            !knownLogins.some((user) => user.USER_LOGIN === log.LOG_USER),
        );
      default:
        return results;
    }
  }
}
