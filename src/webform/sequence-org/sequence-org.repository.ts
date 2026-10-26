import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, In } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SEQUENCEORG } from 'src/common/Entities/webform/table/SEQUENCEORG.entity';
import { SearchSequenceOrgDto } from './dto/search-sequence-org.dto';
import { AMECUSERALL } from 'src/common/Entities/amec/views/AMECUSERALL.entity';

@Injectable()
export class SequenceOrgRepository extends BaseRepository {
    constructor(@InjectDataSource('webformConnection') ds: DataSource) {
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
        const allSubs = new Set<string>();
        let currentQueue: Array<{ empNo: string; cco: string }> = [];

        // 1. Initial subordinates where HEADNO = empno and EMPNO != empno
        const roots = await this.getRepository(SEQUENCEORG).find({
            where: { HEADNO: empno },
        });

        for (const r of roots) {
            if (r.EMPNO && r.EMPNO !== empno) {
                allSubs.add(r.EMPNO);
                currentQueue.push({ empNo: r.EMPNO, cco: r.CCO });
            }
        }

        const visited = new Set<string>();

        // 2. BFS down the management tree
        while (currentQueue.length > 0) {
            const nextQueue: Array<{ empNo: string; cco: string }> = [];
            for (const item of currentQueue) {
                const key = `${item.empNo}_${item.cco}`;
                if (visited.has(key)) continue;
                visited.add(key);

                const subs = await this.getRepository(SEQUENCEORG).find({
                    where: { HEADNO: item.empNo, CCO1: item.cco },
                });

                for (const s of subs) {
                    if (s.EMPNO && s.EMPNO !== empno) {
                        allSubs.add(s.EMPNO);
                        nextQueue.push({ empNo: s.EMPNO, cco: s.CCO });
                    }
                }
            }
            currentQueue = nextQueue;
        }

        if (allSubs.size === 0) {
            return [];
        }

        // 3. Query AMECUSERALL
        return await this.manager.getRepository(AMECUSERALL).find({
            where: {
                SEMPNO: In(Array.from(allSubs)),
                CSTATUS: '1',
            },
        });
    }

    async search(dto: SearchSequenceOrgDto): Promise<SEQUENCEORG[]> {
        return await this.getRepository(SEQUENCEORG).find({ where: dto });
    }

     async getByPosition(VORGNO: string, SPOSCODE: string) {
        return await this.getRepository(SEQUENCEORG).findOne({
            where: {
                VORGNO: VORGNO,
                SPOSCODE: SPOSCODE,
            },
            relations: ['EMPINFO'],
        });
    }

}
