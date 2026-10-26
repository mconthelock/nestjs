import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { FLOWMST } from 'src/common/Entities/webform/table/FLOWMST.entity';

@Injectable()
export class FlowmstRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from FLOWMST`);
        // return this.getRepository(FLOWMST).find();
        return this.manager.find(FLOWMST);
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(FLOWMST, 'F');
        this.applyFilters(qb, 'F', dto, [
            'NFRMNO',
            'VORGNO',
            'CYEAR',
            'CSTEPNO',
        ]);
        return qb.getMany();
    }

    async getFlowMaster(NFRMNO: number, VORGNO: string, CYEAR: string): Promise<FLOWMST[]> {
        const allSteps = await this.getRepository(FLOWMST).find({
            where: { NFRMNO, VORGNO, CYEAR },
        });

        if (!allSteps || allSteps.length === 0) {
            return [];
        }

        const result: FLOWMST[] = [];
        let currentBatch = allSteps.filter((s) => s.CSTART === '1');
        const visited = new Set<string>();

        while (currentBatch.length > 0) {
            const nextBatch: FLOWMST[] = [];
            for (const step of currentBatch) {
                const key = `${step.CSTEPNO}->${step.CSTEPNEXTNO}->${step.VAPVNO ?? ''}`;
                if (visited.has(key)) continue;
                visited.add(key);
                result.push(step);

                if (step.CSTEPNEXTNO && step.CSTEPNEXTNO !== '00') {
                    const nextSteps = allSteps.filter(
                        (s) => s.CSTEPNO === step.CSTEPNEXTNO,
                    );
                    nextBatch.push(...nextSteps);
                }
            }
            currentBatch = nextBatch;
        }

        return result;
    }
}
