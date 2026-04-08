import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { F002KP } from 'src/common/Entities/datacenter/table/F002KP.entity';

@Injectable()
export class F002kpRepository extends BaseRepository {
    constructor(
        @InjectDataSource('datacenterConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from F002KP`);
        // return this.getRepository(F002KP).find();
        return this.manager.find(F002KP);
    }

    findOne(controlNo: string) {
        return this.getRepository(F002KP).findOneBy({ F02R01: controlNo });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(F002KP, 'F');
        this.applyFilters(qb, 'F', dto, ['F02R01', 'F02R03']);
        return qb.getMany();
    }
}
