import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { S020KP } from 'src/common/Entities/datacenter/table/S020KP.entity';

@Injectable()
export class S020kpRepository extends BaseRepository {
    constructor(@InjectDataSource('datacenterConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    find(order: string) {
        return this.getRepository(S020KP).find({
            where: { S20K03: order },
            order: { S20K02: 'ASC', S20K01: 'ASC' },
        });
    }
}
