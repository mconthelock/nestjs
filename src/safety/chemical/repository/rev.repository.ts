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
            relations: {
                CONTROLS: {
                    USER: true,
                },
            },
            order: {
                OWNER: 'ASC',
            },
        });
    }

    getMaster() {
        return this.getRepository(STY_CHEMICAL_REV).findOne({
            where: {
                OWNER: 'MASTER',
            },
            relations: {
                CONTROLS: {
                    USER: true,
                },
            },
        });
    }

    find(type: 'all' | 'active' | 'inactive') {
        const where: any = {};
        if (type === 'active') {
            where.STATUS = 1;
        } else if (type === 'inactive') {
            where.STATUS = 0;
        }
        return this.getRepository(STY_CHEMICAL_REV).find({ where });
    }
}
