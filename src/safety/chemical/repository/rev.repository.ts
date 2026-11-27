import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, In, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_CHEMICAL_REV } from 'src/common/Entities/gpreport/table/STY_CHEMICAL_REV.entity';
import { AMECUSERALL } from 'src/common/Entities/amec/views/AMECUSERALL.entity';
import { ORGPOS } from 'src/common/Entities/webform/table/ORGPOS.entity';

@Injectable()
export class RevRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getSectionActive() {
        return this.getRepository(STY_CHEMICAL_REV).find({
            where: {
                STATUS: 1,
                OWNER: Not('MASTER'),
            },
            relations: {
                CONTROLS: {
                    USER: true,
                },
            },
            order: {
                OWNER: 'ASC',
            },
        });
    }

    getByCode(ownerCode: string[] | string) {
        return this.getRepository(STY_CHEMICAL_REV).find({
            where: {
                OWNERCODE: Array.isArray(ownerCode) ? In(ownerCode) : ownerCode,
            },
            relations: {
                CONTROLS: {
                    USER: true,
                },
            },
            order: {
                OWNER: 'ASC',
            },
        });
    }

    getMaster() {
        return this.getRepository(STY_CHEMICAL_REV).findOne({
            where: {
                OWNER: 'MASTER',
            },
            relations: {
                CONTROLS: {
                    USER: true,
                },
            },
            order: {
                OWNER: 'ASC',
            },
        });
    }

    find(type: 'all' | 'active' | 'inactive' | 'sec-active') {
        const where: any = {};
        if (type === 'active') {
            where.STATUS = 1;
        } else if (type === 'inactive') {
            where.STATUS = 0;
        }
        if (type === 'sec-active') {
            where.STATUS = 1;
            where.OWNERCODE = Not('999999');
        }
        return this.getRepository(STY_CHEMICAL_REV).find({
            where,
            order: { OWNER: 'ASC' },
        });
    }

    findOneByCode(ownerCode: string) {
        return this.getRepository(STY_CHEMICAL_REV).findOne({
            where: { OWNERCODE: ownerCode },
        });
    }

    updateRevisionMaster(revision: string) {
        return this.getRepository(STY_CHEMICAL_REV).update(
            { OWNERCODE: '999999' },
            { REV: revision },
        );
    }

    updateRevision(ownerCode: string, revision: string) {
        return this.getRepository(STY_CHEMICAL_REV).update(
            { OWNERCODE: ownerCode },
            { REV: revision },
        );
    }

    getManagerApprove(ownerCode: string) {
        return this.getRepository(STY_CHEMICAL_REV)
            .createQueryBuilder('R')
            .select(
                `R.OWNER,
                    R.OWNERCODE, 
                    NVL(R.USER_APPROVE, O.VEMPNO) AS EMPNO, 
                    NVL(A.SPOSCODE, O.VPOSNO) AS SPOSCODE, 
                    NVL(A.SNAME, B.SNAME) AS SNAME, 
                    NVL(A.SDEPT, B.SDEPT) AS SDEPT, 
                    NVL(A.SPOSNAME, B.SPOSNAME) AS SPOSNAME, 
                    NVL(TO_CHAR(R.APPROVE_DATE, 'DD MON YYYY'), TO_CHAR(SYSDATE, 'DD MON YYYY')) AS APPROVE_DATE,
                    CASE WHEN R.APPROVE_DATE IS NULL THEN 'NO' ELSE 'YES' END AS APPROVE_STATUS `,
            )
            .leftJoin(AMECUSERALL, 'A', 'R.USER_APPROVE = A.SEMPNO')
            .leftJoin(ORGPOS, 'O', "O.VORGNO = '020601' AND O.VPOSNO = '20'")
            .leftJoin(AMECUSERALL, 'B', 'O.VEMPNO = B.SEMPNO')
            .where('R.OWNERCODE = :ownerCode', { ownerCode })
            .getRawOne();
    }
}
