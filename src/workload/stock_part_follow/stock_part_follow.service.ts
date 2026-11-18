import { Injectable } from '@nestjs/common';
import { StockPartFollowRepository } from './stock_part_follow.repository';
import { CreateStockPartFollowDto } from './dto/create.dto';
@Injectable()
export class StockPartFollowService {
    constructor(private readonly repo: StockPartFollowRepository) {}

    async create(dto: CreateStockPartFollowDto) {
        try {
            const res = await this.repo.create(dto);
            if (!res) {
                return {
                    status: false,
                    message: 'Failed to create data',
                };
            }
            return {
                status: true,
                message: 'Data created successfully',
                data: res,
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
