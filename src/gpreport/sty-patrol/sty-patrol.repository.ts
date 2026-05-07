import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { STY_PATROL } from 'src/common/Entities/gpreport/table/STY_PATROL.entity';
import { CreateStyPatrolDto } from './dto/create-sty-patrol.dto';
import { UpdateStyPatrolDto } from './dto/update-sty-patrol.dto';
@Injectable()
export class StyPatrolRepository extends BaseRepository {
    constructor(@InjectDataSource('gpreportConnection') ds: DataSource) {
        super(ds); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: CreateStyPatrolDto | CreateStyPatrolDto[]) {
        if (Array.isArray(dto)) {
            return this.getRepository(STY_PATROL).save(dto);
        }
        return this.getRepository(STY_PATROL).save(dto);
    }

    async update(dto: UpdateStyPatrolDto) {
        const { NFRMNO, VORGNO, CYEAR, CYEAR2, NRUNNO, PA_ID, ...data } = dto;
        const condition = {
            NFRMNO: NFRMNO,
            VORGNO: VORGNO,
            CYEAR: CYEAR,
            CYEAR2: CYEAR2,
            NRUNNO: NRUNNO,
            PA_ID: PA_ID,
        };
        return this.getRepository(STY_PATROL).update(condition, data);
    }
}
