import { Injectable } from '@nestjs/common';
import { DpmsPackingListMainRepository } from './dpms_packing_list_main.repository';

@Injectable()
export class DpmsPackingListMainService {
    constructor(private readonly repo: DpmsPackingListMainRepository) {}

    async findPackingListByMfgNo(mfgNo: string) {
        try {
            const res = await this.repo.findPackingListByMfgNo(mfgNo);
            if(res.length === 0) {
                return {
                    status: false,
                    message: `No packing list found for MFG No: ${mfgNo}`,
                }
            }
            return {
                status: true,
                message: `${res.length} packing list(s) found for MFG No: ${mfgNo}`,
                data: res,
            }
        } catch (error) {
            throw new Error(`Failed to find packing list for MFG No: ${mfgNo}. Error: ${error.message}`);
        }
    }
}
