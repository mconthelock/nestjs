import { Injectable } from '@nestjs/common';
import { StockPartFollowViewRepository } from './stock_part_follow_view.repository';

@Injectable()
export class StockPartFollowViewService {
    constructor(private readonly repo: StockPartFollowViewRepository) {}

    async findAll() {
        try {
            const res = await this.repo.findAll();
            return res.length > 0
                ? {
                      status: true,
                      message: `Data found ${res.length} records`,
                      data: res,
                  }
                : {
                      status: false,
                      message: 'No data found',
                      data: [],
                  };
        } catch (error) {
            throw error;
        }
    }
}
