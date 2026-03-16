import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { BRCURRENCY } from 'src/common/Entities/amec/table/BRCURRENCY.entity';

@Injectable()
export class BrcurrencyRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async findCurrency() {
        return this.manager.createQueryBuilder(BRCURRENCY, 'B')
            .select(['B.CCURNAME as CCURNAME'])
            .distinct(true)
            .orderBy('B.CCURNAME', 'ASC')
            .getRawMany();
    }
}
