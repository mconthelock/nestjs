import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';

import { GPLY01_TAX } from 'src/common/Entities/webform/table/GPLY01_TAX.entiry';
import { GPLY01_TAXAS400 } from 'src/common/Entities/webform/table/GPLY01_TAXAS400.entity';
import { EMP03T } from 'src/common/Entities/webform/views/EMP03T.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { FLOW } from 'src/common/Entities/webform/table/FLOW.entity';

@Injectable()
export class TaxRepository extends BaseRepository {
    private readonly NFRMNO = 3;
    private readonly VORGNO = '030101';
    private readonly CYEAR = '19';

    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
        super(ds);
    }

    async findEmp03(empno: string): Promise<EMP03T | null> {
        const cleanEmpno = (empno || '').trim();

        // 1. ค้นหาด้วย findOne ก่อน
        const emp = await this.getRepository(EMP03T).findOne({
            where: { EMPCOD: cleanEmpno },
        });
        if (emp) return emp;

        // 2. ถ้าไม่พบ ให้ค้นหาด้วย TRIM(EMPCOD) เพื่อป้องกันปัญหา trailing spaces ของ Oracle CHAR
        return await this.getRepository(EMP03T)
            .createQueryBuilder('emp03')
            .where('TRIM(emp03.EMPCOD) = :empno', { empno: cleanEmpno })
            .getOne();
    }

    async findHistory(empno: string) {
        const cleanEmpno = (empno || '').trim();

        const qb = this.getRepository(GPLY01_TAX)
            .createQueryBuilder('A')
            .leftJoin('A.FORM', 'form')

            // .leftJoin(
            //     FLOW,
            //     'A',
            //     'F.NFRMNO = A.NFRMNO AND F.VORGNO = A.VORGNO AND F.CYEAR = A.CYEAR AND F.CYEAR2 = A.CYEAR2 AND F.NRUNNO = A.NRUNNO AND A.CSTEPNO != :reqStepNon',
            //     { reqStepNon: '--' },
            // )
            // .select([
            //     'F.NFRMNO AS NFRMNO',
            //     'F.VORGNO AS VORGNO',
            //     'F.CYEAR AS CYEAR',
            //     'F.CYEAR2 AS CYEAR2',
            //     'F.NRUNNO AS NRUNNO',
            //     'F.VREQNO AS VREQNO',
            //     'F.VINPUTER AS VINPUTER',
            //     'F.DREQDATE AS DREQDATE',
            //     'F.CREQTIME AS CREQTIME',
            //     'F.CST AS CST',
            //     'A.DAPVDATE AS APVDATE',
            //     'A.CAPVTIME AS APVTIME',
            //     'A.VREMARK AS REMARK',
            //     'A.VREALAPV AS REALAPV',
            // ])
            // .where('F.NFRMNO = :nfrmno', { nfrmno: this.NFRMNO })
            // .andWhere('F.VORGNO = :vorgno', { vorgno: this.VORGNO })
            // .andWhere('F.CYEAR = :cyear', { cyear: this.CYEAR })
            // .andWhere('(TRIM(F.VREQNO) = :empno OR TRIM(F.VINPUTER) = :empno)', { empno: cleanEmpno })
            // .orderBy('F.CYEAR2', 'DESC')
            // .addOrderBy('F.NRUNNO', 'DESC');
            .where('TRIM(A.SEMPNO) = :empno', { empno: cleanEmpno });
        return await qb.getRawMany();
    }
}
