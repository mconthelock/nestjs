import { Injectable } from '@nestjs/common';
import { CondComparisonPriceRepository } from '../repository/cond_comparison_price.repository';
@Injectable()
export class CondComparisonPriceService {
    constructor(private readonly repo: CondComparisonPriceRepository) {}

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-24
     * @description รายการ functions
     * @returns
     */
    async getActive() {
        try {
            const res = await this.repo.getActive();
            if (res.length === 0) {
                return {
                    status: false,
                    message: 'No active records found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Active ${res.length} records retrieved successfully`,
                data: res,
            };
        } catch (error) {
            throw error;
        }
    }
}
