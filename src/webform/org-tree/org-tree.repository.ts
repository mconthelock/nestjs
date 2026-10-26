import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, In, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ORGTREE } from 'src/common/Entities/webform/table/ORGTREE.entity';
import { ORGPOS } from 'src/common/Entities/webform/table/ORGPOS.entity';
import { SEQUENCEORG } from 'src/common/Entities/webform/table/SEQUENCEORG.entity';

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
        // 1. Traverse ancestor org numbers from ORGTREE
        const orgNos: string[] = [orgno];
        let currentOrg = orgno;
        const visitedOrgs = new Set<string>([orgno]);

        while (currentOrg && currentOrg !== '00000') {
            const parent = await this.getRepository(ORGTREE).findOne({
                where: { VORGNO: currentOrg },
            });
            if (
                !parent ||
                !parent.VPARENT ||
                parent.VPARENT === '00000' ||
                visitedOrgs.has(parent.VPARENT)
            ) {
                break;
            }
            visitedOrgs.add(parent.VPARENT);
            orgNos.push(parent.VPARENT);
            currentOrg = parent.VPARENT;
        }

        // 2. Traverse management chain from SEQUENCEORG
        const headNos: string[] = [];
        let currentEmp = empno;
        let currentPos = emppos;
        const visitedHeads = new Set<string>();

        while (currentEmp) {
            const seq = await this.manager.getRepository(SEQUENCEORG).findOne({
                where: { EMPNO: currentEmp, SPOSCODE: currentPos, CCO: '0' },
            });
            if (!seq || !seq.HEADNO || visitedHeads.has(seq.HEADNO)) {
                break;
            }
            visitedHeads.add(seq.HEADNO);
            headNos.push(seq.HEADNO);
            currentEmp = seq.HEADNO;
            currentPos = seq.SPOSCODE1;
        }

        if (orgNos.length === 0 || headNos.length === 0) {
            return [];
        }

        // 3. Find matching ORGPOS
        return await this.manager.getRepository(ORGPOS).find({
            where: {
                VORGNO: In(orgNos),
                VPOSNO: vposno,
                VEMPNO: In(headNos),
            },
        });
    }
}
