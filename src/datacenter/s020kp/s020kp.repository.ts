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

    findFromOrder(order: string) {
        return this.getRepository(S020KP).find({
            where: { S20K01: order },
            order: { S20K02: 'ASC', S20K03: 'ASC' },
        });
    }

    findToOrder(order: string) {
        return this.getRepository(S020KP).find({
            where: { S20K03: order },
            order: { S20K02: 'ASC', S20K01: 'ASC' },
        });
    }

    findAll(order: string) {
        // return this.getRepository(S020KP).find({
        //     where: [{ S20K03: order }, { S20K01: order }],
        //     order: { S20K03: 'ASC', S20K02: 'ASC', S20K01: 'ASC' },
        // });
        return this.getRepository(S020KP).createQueryBuilder('S')
            .where('S.S20K01 = :order OR S.S20K03 = :order', { order })
            .orderBy('CASE WHEN S.S20K03 = :order THEN 1 ELSE 2 END', 'ASC')
            .addOrderBy('S.S20K02', 'ASC')
            .addOrderBy('S.S20K01', 'ASC')
            .getMany();
    }
}
