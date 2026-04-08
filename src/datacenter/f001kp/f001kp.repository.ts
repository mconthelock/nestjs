import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { F001KP } from 'src/common/Entities/datacenter/table/F001KP.entity';

@Injectable()
export class F001kpRepository extends BaseRepository {
    constructor(
        @InjectDataSource('datacenterConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from F001KP`);
        // return this.getRepository(F001KP).find();
        return this.manager.find(F001KP);
    }

    findOne(controlNo: string) {
        return this.getRepository(F001KP).findOneBy({
            F01R01: controlNo,
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(F001KP, 'F');
        this.applyFilters(qb, 'F', dto, [
            'F01R01',
            'F01R02',
            'F01R03',
            'F01R04',
            'F01R05',
            'F01R06',
            'F01R07',
        ]);
        return qb.getMany();
    }
}
