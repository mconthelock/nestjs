import { Injectable } from '@nestjs/common';
import { pkForm } from '../interface/create.interface';
import { PurCpcDetailRepository } from '../repository/purcpc_details.repository';
import { PurCpcRepository } from '../repository/purcpc_form.repository';
import { CreateFormDto } from '../dto/create-pcp-form.dto';
import { PurPraCreateService } from '../../pur-pra/services/pur-pra-create-form.service';

@Injectable()
export class CreatePurCpcService {
    constructor(
        protected readonly repo: PurCpcRepository,
        protected readonly detailsRepo: PurCpcDetailRepository,
        protected readonly prapvFormService: PurPraCreateService,
    ) {}

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-09-30
     * @description แยกหมายเลขฟอร์ม PUR-CPC ออกเป็นคีย์หลัก
     * @param form
     * @returns
     */
    protected crackPrimaryKey(form: string): pkForm {
        const split: string[] = form.split('-');
        const cyear2 = '20' + split[1].replace(/[a-zA-Z]/g, '');
        const nrunno = parseInt(split[2]);
        return {
            CYEAR2: cyear2,
            NRUNNO: nrunno,
        };
    }

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
     * @description สร้างฟอร์ม PRO-CPC ใหม่หรือแก้ไขฟอร์มที่มีอยู่แล้ว
     * @param dto
     */
    async create(dto: CreateFormDto, ip: string) {
        try {
            let cyear2: string = new Date().getFullYear().toString();
            let nrunno: number = 0;
            const formData = {
                VREQNO: dto.REQBY,
                VINPUTER: dto.INPUTBY,
                NFUNCTIONS: dto.FUNC,
                NSTATUS: dto.STATUS,
                NTOTAL_PRES: dto.TOTAL_PRES,
                NTOTAL_NEW: dto.TOTAL_NEW,
                NTOTAL_COST: dto.TOTAL_COST,
                NTOTAL_RATIO: dto.TOTAL_RATIO,
                VVENDOR: dto.VENDOR,
                CMODE: dto.MODE,
            };
            // PRO-CPC26-000001
            if (dto.ISEDIT) {
                const pk = this.crackPrimaryKey(dto.FORMEDIT);
                cyear2 = pk.CYEAR2;
                nrunno = pk.NRUNNO;
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

            // สร้าง Price Approve Form
            if (dto.STATUS === 2) {
                // นำ vendor ที่มี planner ซ้ำออก แล้ววนเอามาต่อกันโดย G, A
                const planner = dto.DETAILS.map((detail) => detail.VPLANNER)
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .join(', ');
                await this.prapvFormService.create(
                    {
                        isDraft: true,
                        REQBY: dto.REQBY,
                        INPUTBY: dto.INPUTBY,
                        DRAFT: '0',
                        PRICE_COMPARE_NO: `PRO-CPC${cyear2.substring(2)}-${nrunno.toString().padStart(6, '0')}`,
                        VVENDOR: dto.VENDOR,
                        NTOTAL_PRES: dto.TOTAL_PRES || 0,
                        NTOTAL_NEW: dto.TOTAL_NEW || 0,
                        NTOTAL_COST: dto.TOTAL_COST || 0,
                        NTOTAL_RATIO: dto.TOTAL_RATIO || 0,
                        NMODE: 1,
                        VPLANNER: planner,
                    },
                    [],
                    ip,
                );
            }
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

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-13
     * @description อัปเดตสถานะของฟอร์ม PUR-CPC ที่ระบุโดย formNo
     * @param formNo PRO-CPC26-000001
     * @param status 2
     */
    async updateStatus(formNo: string, status: number) {
        try {
            const pk = this.crackPrimaryKey(formNo);
            const cyear2 = pk.CYEAR2;
            const nrunno = pk.NRUNNO;
            const result = await this.repo.updateStatus(cyear2, nrunno, status);
            if (!result) {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            throw error;
        }
    }
}
