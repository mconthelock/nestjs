import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { CreateRnfrmDto } from './dto/create-rnfrm.dto';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { RNFRM } from 'src/common/Entities/webform/table/RNFRM.entity';

@Injectable()
export class RnfrmRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
    ) {
        super(ds);
    }

    findAll() {
        return this.manager.find(RNFRM);
    }

    findOne(nfrmno: number, vorgno: string, cyear: string, cyear2: string, nrunno: number,) {
        return this.getRepository(RNFRM).findOneBy({
            NFRMNO: nfrmno,
            VORGNO: vorgno,
            CYEAR: cyear,
            CYEAR2: cyear2,
            NRUNNO: nrunno,
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(RNFRM, 'R');
        this.applyFilters(qb, 'R', dto, [
            'NFRMNO',
            'VORGNO',
            'CYEAR',
            'CYEAR2',
            'NRUNNO',
            'TID',
            'SECCODE',
            'CID',
            'STATUS',
        ]);
        return qb.getMany();
    }

    create(dto: CreateRnfrmDto) {
        return this.manager.save(RNFRM, dto);
    }
}