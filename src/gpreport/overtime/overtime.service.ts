import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { SearchOvertimeDto } from './dto/search-overtime.dto';
import { SearchActualOvertimeDto } from './dto/lr200p.dto';

import { Overtime } from 'src/common/Entities/gpreport/table/overtime.entity';
import { LR200P } from 'src/common/Entities/gpreport/table/LR200P.entity';
import { OTFORM } from 'src/common/Entities/webform/table/OTFORM.entity';

@Injectable()
export class OvertimeService {
    constructor(
        @InjectRepository(Overtime, 'gpreportConnection')
        private readonly otRepo: Repository<Overtime>,

        @InjectRepository(OTFORM, 'gpreportConnection')
        private readonly otform: Repository<OTFORM>,

        @InjectRepository(LR200P, 'gpreportConnection')
        private readonly lr200: Repository<LR200P>,

        @InjectDataSource('gpreportConnection')
        private readonly dataSource: DataSource,
    ) {}

    async findAll(q: SearchOvertimeDto) {
        const qb = this.otform
            .createQueryBuilder('otform')
            .leftJoinAndSelect('otform.user', 'user')
            .leftJoinAndSelect('otform.form', 'form')
            .leftJoinAndSelect('form.flow', 'form_flow');
        await applyDynamicFilters(qb, q, 'otform');
        return qb.getMany();
    }

    async findActual(q: SearchActualOvertimeDto) {
        const qb = this.lr200.createQueryBuilder('lr200');
        await applyDynamicFilters(qb, q, 'lr200');
        return qb.getMany();
    }

    async getOtByWorkdate(workdate: string) {
        return await this.dataSource
            .createQueryBuilder()
            .select([
                'A.CYEAR2 AS CYEAR2, A.NRUNNO AS NRUNNO, A.EMPNO AS EMPNO',
                `TO_CHAR(A.WORKDATE,'DD-MM-YYYY') AS WORKDATE`,
                'A.TIMEIN AS TIMEIN',
                'A.TIMEOUT AS TIMEOUT',
                'A.WKTYPENO AS WKTYPENO',
                'B.CST AS CST',
                'C.SNAME AS SNAME',
                'C.SSEC AS SSEC',
                'C.SDEPT AS SDEPT',
                'C.SDIV AS SDIV',
            ])
            .from('OTFORM', 'A')
            .innerJoin(
                'FORM',
                'B',
                `A.NFRMNO = B.NFRMNO AND A.VORGNO = B.VORGNO AND A.CYEAR = B.CYEAR AND A.CYEAR2 = B.CYEAR2 AND A.NRUNNO = B.NRUNNO`,
            )
            .leftJoin('AMECUSERALL', 'C', 'A.EMPNO = C.SEMPNO')
            .where(`(A.WORKDATE) = TO_DATE(:workdate,'DD-MM-YYYY')`, {
                workdate,
            })
            .andWhere('B.CST IN (1,2)')
            .getRawMany();
    }
}
