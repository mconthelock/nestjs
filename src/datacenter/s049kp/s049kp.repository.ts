import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { S049KP } from 'src/common/Entities/datacenter/table/S049KP.entity';

@Injectable()
export class S049kpRepository extends BaseRepository {
    constructor(@InjectDataSource('datacenterConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    find(order: string) {
        return this.getRepository(S049KP).find({
            where: { S49K01: order },
            order: { S49K02: 'ASC', S49K03: 'ASC' },
        });
    }
}
