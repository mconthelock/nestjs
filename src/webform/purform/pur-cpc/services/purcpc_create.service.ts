import { Injectable } from '@nestjs/common';
import { pkForm } from '../interface/create.interface';
import { PurCpcDetailRepository } from '../repository/purcpc_details.repository';
import { PurCpcRepository } from '../repository/pucpc_form.repository';
import { CreateFormDto } from '../dto/create-pcp-form.dto';

@Injectable()
export class CreatePurCpcService {
    constructor(
        protected readonly repo: PurCpcRepository,
        protected readonly detailsRepo: PurCpcDetailRepository,
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
                NTOTAL_PRES: dto.TOTAL_PRES,
                NTOTAL_NEW: dto.TOTAL_NEW,
                NTOTAL_COST: dto.TOTAL_COST,
                NTOTAL_RATIO: dto.TOTAL_RATIO,
                VVENDOR: dto.VENDOR,
                CMODE: dto.MODE,
            };
            // PUR-CPC26-000001
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
            if(dto.STATUS === 2){

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
}
