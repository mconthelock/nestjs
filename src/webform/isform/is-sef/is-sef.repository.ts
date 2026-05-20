import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { ISEVA_SESSIONS } from 'src/common/Entities/webform/table/ISEVA_SESSIONS.entity';
import { ISEVA_SCORES } from 'src/common/Entities/webform/table/ISEVA_SCORES.entity';
import { ISEVA_CRITERIA } from 'src/common/Entities/webform/table/ISEVA_CRITERIA.entity';
import { WorkPlan } from 'src/common/Entities/docinv/table/work-plan.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class IsSefRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @InjectDataSource('docinvConnection') private docinvDs: DataSource,
    ) {
        super(ds);
    }

    async saveSession(data: Partial<ISEVA_SESSIONS>) {
        return this.getRepository(ISEVA_SESSIONS).save(data);
    }

    async saveScores(data: Partial<ISEVA_SCORES>[]) {
        return this.getRepository(ISEVA_SCORES).save(data);
    }

    async updateSession(keys,data) {
        return this.getRepository(ISEVA_SESSIONS).update(keys, data);
    }

    async updateScore(keys, score) {
        return this.getRepository(ISEVA_SCORES).update(keys, { SCORE: score });
    }

    async findSessionByForm(form: {
        NFRMNO: number;
        VORGNO: string;
        CYEAR: string;
        CYEAR2: string;
        NRUNNO: number;
    }) {
        const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO } = form;

        const [head, detail] = await Promise.all([
            this.getRepository(ISEVA_SESSIONS).findOne({
                where: { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO },
            }),
            this.manager
                .createQueryBuilder(ISEVA_SCORES, 't')
                .innerJoinAndMapOne(
                    't.criteria',
                    ISEVA_CRITERIA,
                    'ic',
                    'ic.EVA_ID = t.EVA_ID',
                )
                .where('t.NFRMNO = :NFRMNO', { NFRMNO })
                .andWhere('t.VORGNO = :VORGNO', { VORGNO })
                .andWhere('t.CYEAR = :CYEAR', { CYEAR })
                .andWhere('t.CYEAR2 = :CYEAR2', { CYEAR2 })
                .andWhere('t.NRUNNO = :NRUNNO', { NRUNNO })
                .getMany(),
        ]);

        return { head, detail };
    }

    async getCriteria() {
        return this.getRepository(ISEVA_CRITERIA).find({
            where: { ACTIVE: '1' },
        });
    }

    async getWorkPlan(filter?: Partial<WorkPlan>) {
        return this.docinvDs.manager
            .getRepository(WorkPlan)
            .find({ where: filter });
    }
}
