import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Like, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { S011MP } from 'src/common/Entities/datacenter/table/S011MP.entity';

@Injectable()
export class S011mpRepository extends BaseRepository {
    constructor(
        @InjectDataSource('datacenterConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from S011MP`);
        // return this.getRepository(S011MP).find();
        return this.manager.find(S011MP);
    }

    findOne(S11M01: string, S11M02: string) {
        return this.getRepository(S011MP).findOneBy({
            S11M01: Like(`%${S11M01}%`),
            S11M02,
        });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(S011MP, 'S');
        this.applyFilters(qb, 'S', dto, [
            'S11M01',
            'S11M02',
            'S11M03',
            'S11M04',
        ]);
        return qb.getMany();
    }

    findByOrder(order: string) {
        return this.getRepository(S011MP).find({
            where: {
                S11M01: order,
            },
        });
    }

    findQtyDiff(order: string) {
        return this.manager.query(`
            SELECT  *
            FROM S011MP A
            WHERE A.S11M01 = :1
            AND EXISTS (
                SELECT 1
                FROM S011MP B
                WHERE B.S11M01 = A.S11M01
                    AND B.S11M02 = A.S11M02
                    AND B.S11M03 = A.S11M03
                    AND B.S11M04 = A.S11M04
                    AND B.S11M05 = A.S11M05
                    AND SUBSTR(B.S11M06, 1, 13) = SUBSTR(A.S11M06, 1, 13)
                GROUP BY B.S11M02, B.S11M03, B.S11M04, B.S11M05, SUBSTR(B.S11M06, 1, 13)
                HAVING COUNT(DISTINCT B.S11M09) > 1
            )`, [order])
    }
}
