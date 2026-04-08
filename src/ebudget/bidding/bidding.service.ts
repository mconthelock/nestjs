import { Injectable } from '@nestjs/common';
import { SearchEbudgetBiddingDto } from './dto/search-bidding.dto';
import { BiddingRepository } from './bidding.repository';

@Injectable()
export class BiddingService {
    constructor(private readonly repo: BiddingRepository) {}

    findAll() {
        return this.repo.findAll();
    }

    async getDataBidding(dto: SearchEbudgetBiddingDto) {
        return await this.repo.getDataBidding(dto);
    }
}
