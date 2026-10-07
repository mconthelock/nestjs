import { Injectable } from '@nestjs/common';
import { PurCpcRepository } from '../repository/pucpc_form.repository';
import { PurcpcProcPlanViewRepository } from '../repository/purcpc_proc_list_view.repository';
import { PurcpcProcCompareViewRepository } from '../repository/purcpc_proc_compare_view.repository';

import {
    PriceComparisonDto,
    PriceComparisonPlannerDto,
} from '../dto/price-comparison.dto';
import { CreatePcpFormDto } from '../dto/create-pcp-form.dto';

import { IimService as Iim400Service } from 'src/as400/bpcsfvnew/iim/iim.service';

@Injectable()
export class PurCpcService {
    constructor(
        private readonly repo: PurCpcRepository,
        private readonly iim400Service: Iim400Service,
        private readonly purcpcProcPlanViewRepo: PurcpcProcPlanViewRepository,
        private readonly purcpcProcCompareViewRepo: PurcpcProcCompareViewRepository,
    ) {}

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-24
     * @description ดึงข้อมูลเพื่อนำไปให้ user เลือกรายการ master เพื่อนำไปหยอดลง excel file เพื่อให้ user กรอกข้อมูลรายการราคาสำหรับเปรียบเทียบ
     * @param data
     * @returns
     */
    async findPlannerCompareSheet(data: PriceComparisonPlannerDto) {
        try {
            switch (data.SYSTEM) {
                case 'AS400':
                    return await this.iim400Service.findPlannerCompareSheet(
                        data.PLANNER,
                    );
                case 'PROCUREMENT':
                    return await this.purcpcProcPlanViewRepo.findByPlanner(
                        data.PLANNER,
                    );
                default:
                    throw new Error(`Unsupported SYSTEM: ${data.SYSTEM}`);
            }
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-24
     * @description ดึงข้อมูลเพื่อไปเปรียบเทียบราคาสินค้าหลังจาก user upload excel file มาแล้ว
     * @param data
     * @returns
     */
    async getPriceComparison(data: PriceComparisonDto) {
        try {
            switch (data.SYSTEM) {
                case 'AS400':
                    return await this.iim400Service.priceComparison(data);
                case 'PROCUREMENT':
                    return await this.purcpcProcCompareViewRepo.findByItemCode(
                        data.ITEM,
                    );
                default:
                    throw new Error(`Unsupported SYSTEM: ${data.SYSTEM}`);
            }
        } catch (error) {
            throw error;
        }
    }

    async create(dto: CreatePcpFormDto) {
        try {
            return await this.repo.create(dto);
        } catch (error) {
            throw error;
        }
    }
}
