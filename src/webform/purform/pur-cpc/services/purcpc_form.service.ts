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
import { CreateFormDto } from '../dto/create-pcp-form.dto';

import { IimService as Iim400Service } from 'src/as400/bpcsfvnew/iim/iim.service';

@Injectable()
export class PurCpcService {
    constructor(
        private readonly repo: PurCpcRepository,
        private readonly detailsRepo: PurCpcDetailRepository,
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

    //---------------------------------------------------------------------------//
    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-29
     * @description ดึงหมายเลขรันถัดไปของฟอร์ม PUR-CPC ตามปีที่ระบุ
     * @param cyear2
     * @returns
     */
    async getFormNextRunNo(cyear2: string): Promise<number> {
        const form = await this.repo.getFormNextRunNo(cyear2);
        if (form.length > 0) {
            return form[0].NRUNNO + 1;
        } else {
            return 1;
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-29
     * @description สร้างฟอร์ม PUR-CPC ใหม่หรือแก้ไขฟอร์มที่มีอยู่แล้ว
     * @param dto
     */
    async create(dto: CreateFormDto) {
        try {
            let cyear2: string = new Date().getFullYear().toString();
            let nrunno: number = 0;
            const formData = {
                VREQNO: dto.REQBY,
                VINPUTER: dto.INPUTBY,
                NFUNCTIONS: dto.FUNC,
                NSTATUS: dto.STATUS,
            };
            // PUR-CPC26-000001
            if (dto.ISEDIT) {
                const split: string[] = dto.FORMEDIT.split('-');
                cyear2 = '20' + split[1].replace(/[a-zA-Z]/g, '');
                nrunno = parseInt(split[2]);
                // clear details
                await this.detailsRepo.delete({
                    CYEAR2: cyear2,
                    NRUNNO: nrunno,
                });
                delete formData.VINPUTER;
            } else {
                nrunno = await this.getFormNextRunNo(cyear2);
            }

            const form = await this.repo.create({
                ...formData,
                CYEAR2: cyear2,
                NRUNNO: nrunno,
            });

            await this.detailsRepo.create(
                dto.DETAILS.map((detail) => ({
                    ...detail,
                    CYEAR2: cyear2,
                    NRUNNO: nrunno,
                })),
            );
            // throw new Error('test');
            return {
                status: true,
                message: 'Form created successfully',
                data: form,
            };
        } catch (error) {
            throw error;
        }
    }
}
