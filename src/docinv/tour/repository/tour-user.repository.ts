import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { TOUR_USER } from 'src/common/Entities/docinv/table/TOUR_USER.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { TourUserSubscriber } from '../subscriber/tour-user.subscriber';

@Injectable()
export class TourUserRepository extends BaseRepository {
    constructor(@InjectDataSource('docinvConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
        ds.subscribers.push(new TourUserSubscriber());
    }

    find() {
        return this.getRepository(TOUR_USER).find();
    }

    findOne(key: string, empno: string) {
        return this.getRepository(TOUR_USER).findOne({
            where: {
                EMPNO: empno,
                TOUR_KEY: key,
            },
        });
    }

    create(data: TOUR_USER) {
        return this.getRepository(TOUR_USER).save(data);
    }
}
