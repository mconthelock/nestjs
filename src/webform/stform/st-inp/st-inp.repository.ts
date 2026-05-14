import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';
import { AMECUSERALL } from 'src/common/Entities/amec/views/AMECUSERALL.entity';

@Injectable()
export class StInpRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getIgnoreList(nfrmno: number, vorgno: string, cyear: string, date?: string) {
        return this.manager
            .createQueryBuilder(FORM, 'F')
            .select(
                `F.NFRMNO, F.VORGNO, F.CYEAR, F.CYEAR2, F.NRUNNO, FL.DAPVDATE AS SEM_APV, 
                TRUNC(${date ? `TO_DATE(:date, 'YYYY-MM-DD')`: 'SYSDATE' } - FL.DAPVDATE) AS DIFF_DAY, TRUNC(${date ? `TO_DATE(:date, 'YYYY-MM-DD')`: 'SYSDATE' } - FL.DAPVDATE)/7 AS DIFF_WEEK,
                FL.VREALAPV AS SEM, A.SNAME AS NAME, A.SRECMAIL AS SEM_MAIL`,
            )
            .innerJoin(
                FLOW,
                'FL',
                `F.NFRMNO = FL.NFRMNO AND F.VORGNO = FL.VORGNO AND F.CYEAR = FL.CYEAR AND F.CYEAR2 = FL.CYEAR2 AND F.NRUNNO = FL.NRUNNO
                AND FL.CEXTDATA = '01' AND FL.CAPVSTNO = '1'`,
            )
            .innerJoin(
                FLOW,
                'FL2',
                `F.NFRMNO = FL2.NFRMNO AND F.VORGNO = FL2.VORGNO AND F.CYEAR = FL2.CYEAR AND F.CYEAR2 = FL2.CYEAR2 AND F.NRUNNO = FL2.NRUNNO
                AND FL2.CEXTDATA = '02' AND FL2.CAPVSTNO = '0'`,
            )
            .innerJoin(
                AMECUSERALL,
                'A',
                `FL.VREALAPV = A.SEMPNO`,
            )
            .where('F.NFRMNO = :nfrmno', { nfrmno })
            .andWhere('F.VORGNO = :vorgno', { vorgno })
            .andWhere('F.CYEAR = :cyear', { cyear })
            .andWhere(`(TRUNC(${date ? `TO_DATE(:date, 'YYYY-MM-DD')`: 'SYSDATE' } - FL.DAPVDATE)/7 = 2  OR TRUNC(${date ? `TO_DATE(:date, 'YYYY-MM-DD')`: 'SYSDATE' } - FL.DAPVDATE)/7 = 3)`)
            .setParameter('date', date)
            .getRawMany();
    }
}
