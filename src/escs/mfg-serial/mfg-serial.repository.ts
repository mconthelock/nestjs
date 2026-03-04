import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { MFG_SERIAL } from 'src/common/Entities/escs/table/MFG_SERIAL.entity';
import { CreateMfgSerialDto } from './dto/create-mfg-serial.dto';
import { UpdateMfgSerialDto } from './dto/update-mfg-serial.dto';

@Injectable()
export class MfgSerialRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: CreateMfgSerialDto | CreateMfgSerialDto[]) {
        if(Array.isArray(dto)) {
            return this.getRepository(MFG_SERIAL).save(dto);
        }
        return this.getRepository(MFG_SERIAL).save(dto);
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from MFG_SERIAL`);
        // return this.getRepository(MFG_SERIAL).find();
        return this.manager.find(MFG_SERIAL);
    }

    findOne(id: number) {
        return this.getRepository(MFG_SERIAL).findOneBy({ NID: id });
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(MFG_SERIAL, 'M');
        this.applyFilters(qb, 'M', dto, ['NID', 'NDRAWINGID', 'VSERIALNO']);
        return qb
            .orderBy('M.NID, M.NDRAWINGID, M.VSERIALNO', 'ASC')
            .getMany();
    }

    async update(id: number, dto: UpdateMfgSerialDto) {
        return this.getRepository(MFG_SERIAL).update(id, dto);
    }

    async remove(id: number | { NID: number } | { NDRAWINGID: number }) {
        return this.getRepository(MFG_SERIAL).delete(id);
    }
}
