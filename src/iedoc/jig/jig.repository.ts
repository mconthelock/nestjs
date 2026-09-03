import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { JigMaster } from 'src/common/Entities/iedoc/table/jig_master.entity';
import { JigInspection } from 'src/common/Entities/iedoc/table/jig_inspection.entity';

@Injectable()
export class JigRepository {
    constructor(
        @InjectRepository(JigMaster)
        private readonly jigMasterRepo: Repository<JigMaster>,

        @InjectRepository(JigInspection)
        private readonly jigInspectionRepo: Repository<JigInspection>,

        private readonly dataSource: DataSource,
    ) {}

    findMaster(jigNo: string) {
        return this.jigMasterRepo.findOne({
            where: { JIG_NO: jigNo },
        });
    }

    findInspection(inspecId: number) {
        return this.jigInspectionRepo.findOne({
            where: { INSPEC_ID: inspecId },
        });
    }

    createMaster(data: Partial<JigMaster>) {
        const entity = this.jigMasterRepo.create(data);
        return this.jigMasterRepo.save(entity);
    }

    getDashboardMaster() {
        return this.jigMasterRepo
            .createQueryBuilder('J')
            .leftJoin(
                'AMECUSERALL',
                'U',
                'TRIM(U.SEMPNO) = TRIM(J.PIC_EMPNO)',
            )
            .select([
                'J.JIG_NO AS "JIG_NO"',
                'J.JIG_NAME AS "JIG_NAME"',
                'J.DRAWING_NO AS "DRAWING_NO"',
                'J.JIG_QTY AS "JIG_QTY"',
                'J.PRICE AS "PRICE"',
                'J.MAKER AS "MAKER"',
                'J.START_USE_DATE AS "START_USE_DATE"',
                'J.ITEMNO AS "ITEMNO"',
                'J.PARTS AS "PARTS"',
                'J.PROCESS_CODE AS "PROCESS_CODE"',
                'J.PIC_EMPNO AS "PIC_EMPNO"',
                'U.SNAME AS "PIC_NAME"',
                'J.INSPEC_PERIOD AS "INSPEC_PERIOD"',
                'J.NEXT_INSPEC_DATE AS "NEXT_INSPEC_DATE"',
                'J.JIG_STATUS AS "JIG_STATUS"',
                'J.REMARK AS "REMARK"',
            ])
            .where(`J.JIG_STATUS = 'ACTIVE'`)
            .orderBy('J.NEXT_INSPEC_DATE', 'ASC')
            .addOrderBy('J.JIG_NO', 'ASC')
            .getRawMany();
    }

    getInspectionByPeriod(startDate: Date, endDate: Date) {
        return this.jigInspectionRepo
            .createQueryBuilder('I')
            .select([
                'I.INSPEC_ID AS "INSPEC_ID"',
                'I.JIG_NO AS "JIG_NO"',
                'I.SCHEDULE_DATE AS "SCHEDULE_DATE"',
                'I.INSPEC_DATE AS "INSPEC_DATE"',
                'I.INSPEC_STATUS AS "INSPEC_STATUS"',
            ])
            .where('I.SCHEDULE_DATE >= :startDate', { startDate })
            .andWhere('I.SCHEDULE_DATE < :endDate', { endDate })
            .orderBy('I.SCHEDULE_DATE', 'ASC')
            .getRawMany();
    }

    async finishInspection(
        inspecId: number,
        inspecDate?: Date,
    ) {
        return this.dataSource.transaction(async manager => {
            const inspection = await manager.findOne(JigInspection, {
                where: { INSPEC_ID: inspecId },
            });

            if (!inspection) return null;

            const jig = await manager.findOne(JigMaster, {
                where: { JIG_NO: inspection.JIG_NO },
            });

            if (!jig) return null;

            inspection.INSPEC_STATUS = 'FINISH';
            inspection.INSPEC_DATE = inspecDate || new Date();
            inspection.UPDATE_DATE = new Date();

            await manager.save(JigInspection, inspection);

            const nextDate = new Date(inspection.SCHEDULE_DATE);
            nextDate.setMonth(
                nextDate.getMonth() + Number(jig.INSPEC_PERIOD),
            );
            nextDate.setDate(1);

            jig.NEXT_INSPEC_DATE = nextDate;
            jig.UPDATE_DATE = new Date();

            await manager.save(JigMaster, jig);

            return {
                inspection,
                jig,
            };
        });
    }
}