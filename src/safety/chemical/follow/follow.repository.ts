import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Raw } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_CHEMICAL_FORM } from 'src/common/Entities/gpreport/table/STY_CHEMICAL_FORM.entity';

@Injectable()
export class FollowRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    getByFyear(fyear: string) {
        return this.manager.getRepository(STY_CHEMICAL_FORM).find({
            where: {
                CREATE_DATE: Raw(
                    (alias) => `TO_CHAR(${alias}, 'YYYY') = :fyear`,
                    { fyear },
                ),
            },
            relations: ['FORM'],
            order: {
                NRUNNO: 'ASC',
            },
        });
    }
}
