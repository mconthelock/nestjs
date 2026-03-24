import { Injectable } from '@nestjs/common';
import { SearchEbudgetBiddingDto } from './dto/search-bidding.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EBUDGET_DATA_BIDDING } from 'src/common/Entities/ebudget/views/EBUDGET_DATA_BIDDING.entity';
import { Repository, MoreThanOrEqual, Like } from 'typeorm';

@Injectable()
export class BiddingService {
    constructor(
        @InjectRepository(EBUDGET_DATA_BIDDING, 'ebudgetConnection')
        private readonly repo: Repository<EBUDGET_DATA_BIDDING>,
    ) {}

    findAll() {
        return this.repo.find({ order: { CYEAR2: 'ASC', NRUNNO: 'ASC' } });
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
        if(dto.SSECCODE) {
            where['REQSEC'] = dto.SSECCODE;
            where['INPUTSEC'] = dto.SSECCODE;
        }
        if(dto.SDEPCODE) {
            where['REQDEP'] = dto.SDEPCODE;
            where['INPUTDEP'] = dto.SDEPCODE;
        }
        if(dto.SDIVCODE) {
            where['REQDIV'] = dto.SDIVCODE;
            where['INPUTDIV'] = dto.SDIVCODE;
        }
        return await this.repo.find({
            where,
            order: { NRUNNO: 'ASC' },
        });
    }
}
