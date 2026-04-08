import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { EBGREQCASE } from 'src/common/Entities/ebudget/table/EBGREQCASE.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
@Injectable()
export class EbgreqcaseRepository extends BaseRepository {
    constructor(
        @InjectDataSource('ebudgetConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(EBGREQCASE).find();
    }

    findOne(id: number) {
        return this.getRepository(EBGREQCASE).findOneBy({ ID: id });
    }
}
