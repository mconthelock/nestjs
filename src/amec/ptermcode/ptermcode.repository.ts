import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { PTERMCODE } from 'src/common/Entities/amec/table/PTERMCODE.entity';

@Injectable()
export class PtermcodeRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async findTermcode() {
        return this.manager.createQueryBuilder(PTERMCODE, 'T')
            .select(['T.STERMDESC as TERMNAME , T.STERMCODE as TERMCODE'])
            .distinct(true)
            .orderBy('T.STERMCODE', 'ASC')
            .getRawMany();
    }
}