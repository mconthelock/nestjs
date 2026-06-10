import * as dayjsModule from 'dayjs';
const dayjs = (dayjsModule as any).default ?? (dayjsModule as any);
import * as utcModule from 'dayjs/plugin/utc';
import * as timezoneModule from 'dayjs/plugin/timezone';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LOGIN_REASON } from 'src/common/Entities/webform/table/LOGIN_REASON.entity';
import { ISOFF_VARIEDOFF } from 'src/common/Entities/webform/table/ISOFF_VARIEDOFF.entity';

import { CreateIsOffDto } from './dto/create-is-off.dto';
import { UpdateIsOffDto } from './dto/update-is-off.dto';
import { SearchIsOffDto } from './dto/search-is-off.dto';

const utc = (utcModule as any).default ?? (utcModule as any);
const timezone = (timezoneModule as any).default ?? (timezoneModule as any);
dayjs.extend(utc);
dayjs.extend(timezone);
@Injectable()
export class IsOffService {
    constructor(
        @InjectRepository(LOGIN_REASON, 'webformConnection')
        private readonly reason: Repository<LOGIN_REASON>,

        @InjectRepository(ISOFF_VARIEDOFF, 'webformConnection')
        private readonly off: Repository<ISOFF_VARIEDOFF>,
    ) {}

    async create(createIsOffDto: CreateIsOffDto) {
        return await this.off.save(createIsOffDto);
    }

    async search(data: SearchIsOffDto) {
        const { query, startDate, endDate } = data;
        const queryBuilder = this.off.createQueryBuilder('off');
        if (query) {
            queryBuilder.andWhere('off.OFF_DISPLAYNAME LIKE :query', {
                query: `%${query}%`,
            });
        }

        // if (empNo) {
        //     queryBuilder.andWhere('off.OFF_EMPNO = :empNo', {
        //         empNo,
        //     });
        // }

        if (startDate) {
            const startOfDayBangkok = dayjs(startDate)
                .tz('Asia/Bangkok')
                .startOf('day');
            queryBuilder.andWhere('off.OFF_DATE >= :startDate', {
                startDate: startOfDayBangkok.toDate(),
            });
        }

        if (endDate) {
            const endOfRangeBangkok = dayjs(endDate)
                .tz('Asia/Bangkok')
                .startOf('day')
                .add(1, 'day');
            queryBuilder.andWhere('off.OFF_DATE <= :endDate', {
                endDate: endOfRangeBangkok.toDate(),
            });
        }
        return await queryBuilder.getMany();
    }

    async findReason() {
        return await this.reason.find();
    }
}
