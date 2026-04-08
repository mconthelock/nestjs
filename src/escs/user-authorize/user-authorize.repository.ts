import { Inject, Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { USERS_AUTHORIZE } from 'src/common/Entities/escs/table/USERS_AUTHORIZE.entity';

@Injectable()
export class UsersAuthorizeRepository extends BaseRepository {
    constructor(
        @InjectDataSource('escsConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    async create(dto: any) {
        return this.getRepository(USERS_AUTHORIZE).save(dto);
    }
}
