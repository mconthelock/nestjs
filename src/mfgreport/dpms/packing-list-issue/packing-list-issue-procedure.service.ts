import { Injectable } from '@nestjs/common';
import { PackingListIssueProcedureWorkloadRepository, PackinglistIssueProcedureDataCenterRepository } from './packing-list-issue.repository';
import { SearchDpmsPlIssueDto } from 'src/workload/dpms_pl_issue/dto/search-dpms_pl_issue.dto';

@Injectable()
export class PackingListIssueProcedureService {
    constructor(
        private readonly workloadRepo: PackingListIssueProcedureWorkloadRepository,
        private readonly dataCenterRepo: PackinglistIssueProcedureDataCenterRepository,
    ) {}

    async getReportProdList(prod: string) {
        try {
            const res = await this.workloadRepo.getReportProdList(prod);
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
            const res = await this.workloadRepo.getReportDayList(day);
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

    async getShopOrder(ordermain: string) {
        try {
            const res = await this.dataCenterRepo.getShopOrder(ordermain);
            if (res.length === 0 || !res[0].SHOP_ORDER) {
                return {
                    status: false,
                    message: 'No data found',
                };
            }
            return {
                status: true,
                data: res[0].SHOP_ORDER,
            };
        } catch (error) {
            throw new Error(`Failed to get shop order: ${error.message}`);
        }
    }

    async getLastRevDocument(dto: SearchDpmsPlIssueDto) {
        try {
            const res = await this.workloadRepo.getLastRevDocument(dto);
            if (res.length === 0) {
                return {
                    status: false,
                    message: 'No data found',
                };
            }
            return {
                status: true,
                message: `Get revise list ${res.length} records`,
                data: res,
            };
        }
        catch (error) {
            throw new Error(`Failed to get revise list: ${error.message}`);
        }
    }
}
