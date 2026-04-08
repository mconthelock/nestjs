import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { Request } from 'express';
import { EBUDGET_DATA_BIDDING } from 'src/common/Entities/ebudget/views/EBUDGET_DATA_BIDDING.entity';
import { BaseRepository } from 'src/common/repositories/base-repository';
import { DataSource, Like, MoreThanOrEqual } from 'typeorm';
import { SearchEbudgetBiddingDto } from './dto/search-bidding.dto';
@Injectable({ scope: Scope.REQUEST })
export class BiddingRepository extends BaseRepository {
    constructor(
        @InjectDataSource('ebudgetConnection') ds: DataSource,
        @Inject(REQUEST) req: Request,
    ) {
        super(ds, req as Request); // นำค่าไปเก็บและใช้ใน BaseRepository
    }

    findAll() {
        return this.getRepository(EBUDGET_DATA_BIDDING).find({
            order: { CYEAR2: 'ASC', NRUNNO: 'ASC' },
        });
    }

    async getDataBidding(dto: SearchEbudgetBiddingDto) {
        const where = {};
        if (dto.VREQNO) {
            where['VREQNO'] = dto.VREQNO;
        }
        if (dto.CYEAR2) {
            where['CYEAR2'] = MoreThanOrEqual(dto.CYEAR2);
        }
        if (dto.FORMNO) {
            where['FORMNO'] = Like(`%${dto.FORMNO}%`);
        }
        if (dto.SSECCODE) {
            where['REQSEC'] = dto.SSECCODE;
            where['INPUTSEC'] = dto.SSECCODE;
        }
        if (dto.SDEPCODE) {
            where['REQDEP'] = dto.SDEPCODE;
            where['INPUTDEP'] = dto.SDEPCODE;
        }
        if (dto.SDIVCODE) {
            where['REQDIV'] = dto.SDIVCODE;
            where['INPUTDIV'] = dto.SDIVCODE;
        }
        return await this.getRepository(EBUDGET_DATA_BIDDING).find({
            where,
            order: { NRUNNO: 'ASC' },
        });
    }
}
