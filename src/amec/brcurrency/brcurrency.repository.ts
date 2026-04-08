import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { BRCURRENCY } from 'src/common/Entities/amec/table/BRCURRENCY.entity';

@Injectable()
export class BrcurrencyRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async findCurrency() {
        return this.manager.createQueryBuilder(BRCURRENCY, 'B')
            .select(['B.CCURNAME as CCURNAME'])
            .distinct(true)
            .orderBy('B.CCURNAME', 'ASC')
            .getRawMany();
    }
}
