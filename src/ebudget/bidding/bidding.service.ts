import { Injectable } from '@nestjs/common';
import { SearchEbudgetBiddingDto } from './dto/search-bidding.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EBUDGET_DATA_BIDDING } from 'src/common/Entities/ebudget/views/EBUDGET_DATA_BIDDING.entity';
import { Repository } from 'typeorm';

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
    return await this.repo.find({
      where: {
        VREQNO: dto.VREQNO,
        CYEAR2: dto.CYEAR2,
      },
      order: { NRUNNO: 'ASC' },
    });
  }
}
