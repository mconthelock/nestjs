import { Injectable } from '@nestjs/common';
import { IimRepository } from './iim.repository';

@Injectable()
export class IimService {
    constructor(private readonly repo: IimRepository) {}

    async findPlannerCompareSheet(planner: string | string[]) {
        try {
            const res = await this.repo.findPlannerCompareSheet(planner);
            if (res.length == 0) {
                return {
                    status: false,
                    message: 'No records found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Found ${res.length} records`,
                data: res,
            };
        } catch (error) {
            throw error;
        }
    }
}
