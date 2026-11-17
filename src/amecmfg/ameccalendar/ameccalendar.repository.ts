import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { Ameccalendar } from './entities/ameccalendar.entity';
import { GetProdDto } from './dto/GetProd.dto';

@Injectable()
export class AmeccalendarRepository extends BaseRepository {
    constructor(@InjectDataSource('datacenterConnection') ds: DataSource) {
        super(ds);
    }

    getPreviousProd(dto: GetProdDto) {
        return this.manager
            .createQueryBuilder()
            .from(
                (subQuery) =>
                    subQuery
                        .select('calendar.SCHDNUMBER', 'SCHDNUMBER')
                        .addSelect('DENSE_RANK() OVER (ORDER BY calendar.WORKID DESC)', 'MTHRANK')
                        .from(Ameccalendar, 'calendar')
                        .where('calendar.PRIORITY = :priority', {
                            priority: 'P1',
                        })
                        .andWhere(`calendar.WORKID <= TO_NUMBER(TO_CHAR(SYSDATE, 'YYYYMMDD'))`),
                'ranked',
            )
            .where('"ranked"."MTHRANK" <= :num', { num: dto.num })
            .orderBy('"ranked"."MTHRANK"', dto.order ?? 'ASC')
            .getRawMany();
    }

    getNextProd(dto: GetProdDto) {
        return this.manager
            .createQueryBuilder()
            .from(
                (subQuery) =>
                    subQuery
                        .select('calendar.SCHDNUMBER', 'SCHDNUMBER')
                        .addSelect('DENSE_RANK() OVER (ORDER BY calendar.WORKID ASC)', 'MTHRANK')
                        .from(Ameccalendar, 'calendar')
                        .where('calendar.PRIORITY = :priority', {
                            priority: 'P1',
                        })
                        .andWhere(`calendar.WORKID >= TO_NUMBER(TO_CHAR(SYSDATE, 'YYYYMMDD'))`),
                'ranked',
            )
            .where('"ranked"."MTHRANK" <= :num', { num: dto.num })
            .orderBy('"ranked"."MTHRANK"', dto.order ?? 'ASC')
            .getRawMany();
    }
}
