import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { CalculateUsageDto } from './dto/calculate-usage.dto';
import { WHN_AUTOPLAN } from 'src/common/Entities/innovat/views/WHN_AUTOPLAN.entity';

@Injectable()
export class WireHarnessCalculateUsageRepository extends BaseRepository {
    constructor(
        @InjectDataSource('innovatConnection')
        private readonly ds: DataSource,
    ) {
        super(ds);
    }

    list(dto: CalculateUsageDto) {
        return this.getRepository(WHN_AUTOPLAN)
            .createQueryBuilder('A')
            .select([
                'A.ITEMCODE AS ITEMCODE',
                'A.CABLE AS CABLE',
                'A.LMASTER AS LMASTER',
                'SUM(A.CUT) AS QTYL',
                'ROUND(SUM(A.CUT) / A.LMASTER, 1) AS QTYDRUM',
            ])
            .where('A.GRPID = :groupId', {
                groupId: dto.groupId,
            })
            .andWhere('A.PRODNO BETWEEN :prodNoFrom AND :prodNoTo', {
                prodNoFrom: dto.prodNoFrom,
                prodNoTo: dto.prodNoTo,
            })
            .groupBy('A.ITEMCODE')
            .addGroupBy('A.CABLE')
            .addGroupBy('A.LMASTER')
            .orderBy('A.ITEMCODE', 'ASC')
            .getRawMany();
    }
}