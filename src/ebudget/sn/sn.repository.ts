import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { SearchEbudgetSnDto } from './dto/search-sn.dto';
import { EBUDGET_DATA_SN } from 'src/common/Entities/ebudget/views/EBUDGET_DATA_SN.entity';

@Injectable()
export class SnRepository extends BaseRepository {
    constructor(
        @InjectDataSource('ebudgetConnection') ds: DataSource,
        ) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(EBUDGET_DATA_SN).find({
            order: { FYEAR: 'ASC', SN: 'ASC' },
        });
    }

    async getDataSn(dto: SearchEbudgetSnDto) {
        return await this.getRepository(EBUDGET_DATA_SN).find({
            where: {
                VORGCODE: dto.VORGCODE,
                FYEAR: dto.FYEAR,
                CSTATUS: '1',
            },
            order: { SN: 'ASC' },
        });
    }
}
