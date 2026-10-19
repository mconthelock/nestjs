import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PILINE_SECTION_MST } from 'src/common/Entities/workload/table/PILINE_SECTION_MST.entity';
import { Psection } from 'src/amec/psection/entities/psection.entity';
import { PilineCrudRepository } from '../piline/PILINE-CRUD.repository';

@Injectable()
export class PilineSectionMstRepository extends PilineCrudRepository<PILINE_SECTION_MST> {
    constructor(
        @InjectDataSource('workloadConnection') ds: DataSource,
        @InjectDataSource('amecConnection') private readonly amecDs: DataSource,
    ) {
        super(ds, PILINE_SECTION_MST);
    }

    async findAll() {
        const result = await super.findAll();
        if (!result.data.length) return result;
        // The two tables use separate connections; join their results by section code.
        const sections = await this.amecDs.getRepository(Psection).find({
            select: { SSECCODE: true, SSEC: true },
        });
        const names = new Map(sections.map(section => [section.SSECCODE.trim(), section.SSEC?.trim()]));
        return {
            status: true,
            data: result.data.map(section => ({
                ...section,
                SSECCODE: section.SSECCODE.trim(),
                SSEC: names.get(section.SSECCODE.trim()) || section.SSECCODE.trim(),
            })),
        };
    }
}
