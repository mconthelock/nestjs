import { Injectable } from '@nestjs/common';
import { FollowRepository } from './follow.repository';
import { FormService } from 'src/webform/form/form.service';

@Injectable()
export class FollowService {
    constructor(
        private readonly repository: FollowRepository,
        private readonly formService: FormService,
    ) {}

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-28
     * @description ดึงข้อมูล form ตามปีงบประมาณ (fyear) เพื่อนำไปแสดงหน้าติดตามฟอร์มของสารเคมี
     * @param fyear
     * @returns ข้อมูลฟอร์มตามปีงบประมาณ (fyear)
     */
    async getByFyear(fyear: string) {
        try {
            const forms = await this.repository.getByFyear(fyear);
            if (forms.length > 0) {
                const res = [];
                for (const form of forms) {
                    const formDetails = await this.formService.getFormno({
                        NFRMNO: form.NFRMNO,
                        VORGNO: form.VORGNO,
                        CYEAR: form.CYEAR,
                        CYEAR2: form.CYEAR2,
                        NRUNNO: form.NRUNNO,
                    });
                    res.push({
                        FORMNO: formDetails,
                        CST: form.FORM.CST,
                        OWNER: form.OWNER,
                        CHEMICAL_NAME: form.CHEMICAL_NAME,
                        FORM_TYPE: form.FORM_TYPE,
                    });
                }
                return {
                    status: true,
                    message: `Data found ${forms.length} records`,
                    data: res,
                };
            }
            return {
                status: false,
                message: 'No records found',
            };
        } catch (error) {
            throw error;
        }
    }
}
