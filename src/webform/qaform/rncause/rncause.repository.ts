import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base-repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { RNCAUSE } from 'src/common/Entities/webform/table/RNCAUSE.entity';

@Injectable()
export class RncauseRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
    ) {
        super(ds);
    }

    findAll() {
        return this.manager.find(RNCAUSE);
    }

    findOne(cid: number) {
        return this.getRepository(RNCAUSE).findOneBy({
            CID: cid,
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(RNCAUSE, 'R');

        this.applyFilters(qb, 'R', dto, [
            'CID',
            'CAUSE',
            'CAUSENAME',
        ]);

        return qb.getMany();
    }
}