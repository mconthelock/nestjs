import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_CHEMICAL_REV } from 'src/common/Entities/gpreport/table/STY_CHEMICAL_REV.entity';

@Injectable()
export class RevRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getSectionActive() {
        return this.getRepository(STY_CHEMICAL_REV).find({
            where: {
                STATUS: 1,
                OWNER: Not('MASTER'),
            },
        });
    }

    findAll() {
        return this.getRepository(STY_CHEMICAL_REV).find();
    }
}
