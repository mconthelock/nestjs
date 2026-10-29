import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { TOUR } from 'src/common/Entities/docinv/table/TOUR.entity';

@Injectable()
export class TourRepository extends BaseRepository {
    constructor(@InjectDataSource('docinvConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    find() {
        return this.getRepository(TOUR).find();
    }

    findOne(key: string) {
        return this.getRepository(TOUR).findOne({
            where: {
                KEY: key,
            },
        });
    }
}
