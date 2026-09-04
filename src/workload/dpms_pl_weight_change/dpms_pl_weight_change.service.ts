import { Injectable } from '@nestjs/common';
import { DpmsPlWeightChangeRepository } from './dpms_pl_weight_change.repository';
@Injectable()
export class DpmsPlWeightChangeService {
    constructor(private readonly repo: DpmsPlWeightChangeRepository) {}

    async getChangeWeight(vanndate?: string) {
        try {
            const res = await this.repo.getChangeWeight(vanndate);
            if (res.length === 0) {
                return {
                    status: false,
                    message: 'No data found',
                };
            }
            return {
                status: true,
                message: `Data retrieved ${res.length} records`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Error retrieving change weight data: ${error.message}`,
            );
        }
    }
}
