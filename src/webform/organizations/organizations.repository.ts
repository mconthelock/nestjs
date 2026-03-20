import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Not } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { ORGANIZATIONS } from 'src/common/Entities/webform/views/ORGANIZATIONS.entity';

@Injectable()
export class OrganizationsRepository extends BaseRepository {
    constructor(
        @InjectDataSource('webformConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        // ใช้ได้ทั้งหมด
        // return this.manager.query(`select * from ORGANIZATIONS`);
        // return this.getRepository(ORGANIZATIONS).find();
        return this.manager.find(ORGANIZATIONS);
    }

    async search(dto: FiltersDto) {
        const qb = this.manager.createQueryBuilder(ORGANIZATIONS, 'O');
        this.applyFilters(qb, 'O', dto, ['SDEPCODE', 'SDIVCODE', 'SSEC']);
        return qb.getMany();
    }
}
