import { Injectable } from '@nestjs/common';
import { PurCpcRepository } from '../repository/pucpc_form.repository';
import { PurcpcProcPlanViewRepository } from '../repository/purcpc_proc_list_view.repository';
import { PurcpcProcCompareViewRepository } from '../repository/purcpc_proc_compare_view.repository';
import { PurCpcDetailRepository } from '../repository/purcpc_details.repository';

import {
    PriceComparisonDto,
    PriceComparisonPlannerDto,
    PriceComparisonListDto,
} from '../dto/price-comparison.dto';

import { IimService as Iim400Service } from 'src/as400/bpcsfvnew/iim/iim.service';
import { CreatePurCpcService } from './purcpc_create.service';

@Injectable()
export class PurCpcService extends CreatePurCpcService {
    constructor(
        protected readonly repo: PurCpcRepository,
        protected readonly detailsRepo: PurCpcDetailRepository,
        private readonly iim400Service: Iim400Service,
        private readonly purcpcProcPlanViewRepo: PurcpcProcPlanViewRepository,
        private readonly purcpcProcCompareViewRepo: PurcpcProcCompareViewRepository,
    ) {
        super(repo, detailsRepo);
    }

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

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-29
     * @description ดึงข้อมูลรายการเปรียบเทียบราคาสินค้า
     * @param data
     * @returns
     */
    async getLists(data: PriceComparisonListDto) {
        try {
            const res = await this.repo.getLists(data);
            if (res.length == 0) {
                return {
                    status: false,
                    message: 'No records found',
                };
            }
            return {
                status: true,
                message: `found ${res.length} records`,
                data: res,
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-30
     * @description ดึงข้อมูลฟอร์ม PUR-CPC ตามหมายเลขฟอร์มที่ระบุ
     * @param form หมายเลขฟอร์ม PUR-CPC ที่ต้องการดึงข้อมูล
     * @returns
     */
    async getForm(form: string) {
        try {
            const pk = this.crackPrimaryKey(form);
            const res = await this.repo.getForm(pk);
            if (res.length == 0) {
                return {
                    status: false,
                    message: 'No records found',
                };
            }
            return {
                status: true,
                message: `found ${res.length} records`,
                data: res,
            };
        } catch (error) {
            throw error;
        }
    }
}
