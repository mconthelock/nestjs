import { Injectable } from '@nestjs/common';
import { AmecordersScheduleRepository } from './amecorders_schedule.repository';

@Injectable()
export class AmecordersScheduleService {
    constructor(private readonly repo: AmecordersScheduleRepository) {}

    async getMfgbmRange(jung: string) {
        try {
            const res = await this.repo.getMfgbmRange(jung);
            if (!res) {
                return {
                    status: false,
                    message: 'No data found for the given jung value',
                };
            }
            return {
                status: true,
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to get Mfgbm range for jung value ${jung}: ${error.message}`);
        }
    }
}
