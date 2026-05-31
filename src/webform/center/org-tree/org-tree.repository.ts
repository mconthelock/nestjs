import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ORGTREE } from 'src/common/Entities/webform/table/ORGTREE.entity';

@Injectable()
export class OrgTreeRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from ORGTREE`);
        // return this.getRepository(ORGTREE).find();
        return this.manager.find(ORGTREE);
    }

    findOne(VORGNO: string) {
        return this.getRepository(ORGTREE).findOneBy({
            VORGNO,
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(ORGTREE, 'O');
        this.applyFilters(qb, 'O', dto, ['VORGNO', 'VPOSNO', 'VEMPNO']);
        return qb.getMany();
    }

    async getOrgTree(
        orgno: string,
        vposno: string,
        empno: string,
        emppos: string,
    ) {
        return this.manager.query(
            ` SELECT *
        FROM ORGPOS
        WHERE VORGNO IN (
        SELECT DISTINCT VORGNO
        FROM ORGTREE
        START WITH VORGNO = :1
        CONNECT BY VORGNO = PRIOR vParent
        )
        AND VPOSNO = :2
        AND VEMPNO IN (
        SELECT headNo
        FROM sequenceOrg
        START WITH empNo = :3
            AND sPosCode = :4
            AND cCo = '0'
        CONNECT BY PRIOR headNo = empNo
            AND PRIOR sPosCode1 = sPosCode
        )`,
            [orgno, vposno, empno, emppos],
        );
    }
}
