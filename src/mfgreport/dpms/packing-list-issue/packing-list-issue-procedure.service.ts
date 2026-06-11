import { Injectable } from '@nestjs/common';
import { PackingListIssueProcedureRepository } from './packing-list-issue.repository';

@Injectable()
export class PackingListIssueProcedureService {
    constructor(
        private readonly procedureRepo: PackingListIssueProcedureRepository,
    ) {}

    async getReportProdList(prod: string) {
        try {
            const res = await this.procedureRepo.getReportProdList(prod);
            if (res.length === 0) {
                return {
                    status: false,
                    message: 'No data found',
                };
            }
            return {
                status: true,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to get report production list: ${error.message}`,
            );
        }
    }

    async getReportDayList(day: string) {
        try {
            const res = await this.procedureRepo.getReportDayList(day);
            if (res.length === 0) {
                return {
                    status: false,
                    message: 'No data found',
                };
            }
            return {
                status: true,
                data: res,
            };
        } catch (error) {
            throw new Error(`Failed to get report day list: ${error.message}`);
        }
    }
}
