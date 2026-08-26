import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { PCURRENCY } from 'src/common/Entities/amec/table/PCURRENCY.entity';

@Injectable()
export class PcurrencyRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async findCurrency() {
        return this.manager.createQueryBuilder(PCURRENCY, 'C')
            .select(['C.SCURCODE as CURCODE , C.SCURRENCY as CURRENCY'])
            .distinct(true)
            .orderBy('C.SCURRENCY', 'ASC')
            .getRawMany();
    }
}