import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SEQUENCEORG } from 'src/common/Entities/webform/table/SEQUENCEORG.entity';
import { SearchSequenceOrgDto } from './dto/search-sequence-org.dto';

@Injectable()
export class SequenceOrgRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(SEQUENCEORG).find();
    }

    async getManager(empno: string, selectFields?: string[]) {
        const query = this.getRepository(SEQUENCEORG)
            .createQueryBuilder('seq')
            .select('seq.HEADNO', 'HEADNO')
            .where('seq.EMPNO = :empno', { empno })
            .andWhere(
                'seq.SPOSCODE = (select SPOSCODE from AMECUSERALL where sEmpNo = :empno2)',
                { empno2: empno },
            )
            .orderBy('seq.CCO', 'ASC');
        if (selectFields && selectFields.length > 0) {
            const select = selectFields.map((field) => ({
                column: `seq.${field}`,
                alias: field,
            }));
            for (const s of select) {
                query.addSelect(s.column, s.alias);
            }
        }
        return query.getRawMany();

        //  return this.getRepository(SEQUENCEORG)
        //     .createQueryBuilder('seq')
        //     .select('seq.HEADNO', 'HEADNO')
        //     .where('seq.EMPNO = :empno', { empno })
        //     .andWhere(
        //         'seq.SPOSCODE = (select SPOSCODE from AMECUSERALL where sEmpNo = :empno2)',
        //         { empno2: empno },
        //     )
        //     .orderBy('seq.CCO', 'ASC')
        //     .getRawMany();
    }

    async getSubordinates(empno: string) {
        const sql = `
                 SELECT DISTINCT B.* FROM 
                    (
                        SELECT * FROM SEQUENCEORG
                        START WITH HEADNO = :1 AND EMPNO != :2 CONNECT BY PRIOR EMPNO = HEADNO AND PRIOR CCO = CCO1
                    ) A
                    JOIN AMECUSERALL B ON A.EMPNO = B.SEMPNO
                    WHERE B.SEMPNO != :3  AND B.CSTATUS = 1
                `;
        return await this.manager.query(sql, [empno, empno, empno]);
    }

    async search(dto: SearchSequenceOrgDto): Promise<SEQUENCEORG[]> {
        return await this.getRepository(SEQUENCEORG).find({ where: dto });
    }
}
