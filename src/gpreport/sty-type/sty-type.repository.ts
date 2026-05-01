import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_TYPE } from 'src/common/Entities/gpreport/table/STY_TYPE.entity';

@Injectable()
export class StyTypeRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findByTypeCode(typecode: string) {
        return this.getRepository(STY_TYPE).find({
            where: {
                TYPE_CODE: typecode,
            },
            order: {
                TYPE_NO: 'ASC',
            }
        });
    }
}
