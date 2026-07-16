import { Injectable } from '@nestjs/common';
import { CreateCheckinventoryDto } from './dto/create-checkinventory.dto';
import { UpdateYearlyDto } from './dto/update-yearly.dto';
import { CheckinventoryRepository } from './checkinventory.repository';
import { CreateYearlyFormDto } from './dto/create-yearlyform.dto';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';
import { INV_YEARLY_RESULT } from 'src/common/Entities/skid/table/INV_YEARLY_RESULT.entity';
import { FindOptionsWhere, QueryDeepPartialEntity } from 'typeorm';

@Injectable()
export class CheckinventoryService {
    constructor(
        private readonly chkrepo: CheckinventoryRepository,
        private readonly formCreateService: FormCreateService,
        private readonly formmstService: FormmstService,
    ) {}

    async getHalfyearReport() {
        try {
            return await this.chkrepo.getHalfyearReport();
        } catch (error) {
            throw error;
        }
    }

    async getHalfyearReportAssign(REPORT_ID: number) {
        try {
            return await this.chkrepo.getHalfyearReportAssign(REPORT_ID);
        } catch (error) {
            throw error;
        }
    }

    async createHalfyearReport(empno: string, periods: string) {
        try {
            return await this.chkrepo.createHalfyearReport(empno, periods);
        } catch (error) {
            throw error;
        }
    }

    async createHalfyearReportWithForm(
        empno: string,
        periods: string,
        formData: {
            NFRMNO: number;
            VORGNO: string;
            CYEAR: string;
            CYEAR2: string;
            NRUNNO: number;
        },
    ) {
        try {
            const REPORT_ID = await this.chkrepo.createHalfyearReport(
                empno,
                periods,
            );
            await this.chkrepo.insertHalfyearForm({ ...formData, REPORT_ID });
            return { REPORT_ID };
        } catch (error) {
            throw error;
        }
    }

    async getYearlyAssign() {
        return await this.chkrepo.getYearlyAssign();
    }

    async createYearlyReport(YEAR: string, PERIOD: string, EMPNO: string) {
        try {
            return {
                id: await this.chkrepo.createYearlyReport(YEAR, PERIOD, EMPNO),
            };
        } catch (error) {
            throw error;
        }
    }

    async updateYearlyReport(dto: UpdateYearlyDto) {
        return this.chkrepo.updateYearlyReport(dto);
    }

    async checkYearlyActualChecked(reportID: number) {
        return this.chkrepo.checkYearlyActualChecked(reportID);
    }

    async insertYearlyForm(dto: CreateYearlyFormDto, ip: string) {
        const formmst =
            await this.formmstService.getFormMasterByVaname('PS-YIC');
        if (!formmst) {
            throw new Error(
                'Form master not found for PS-YIC. Check FORMMST table.',
            );
        }
        const createForm = await this.formCreateService.create(
            {
                NFRMNO: formmst.NNO,
                VORGNO: formmst.VORGNO,
                CYEAR: formmst.CYEAR,
                REQBY: dto.REQBY,
                INPUTBY: dto.INPUTBY,
                REMARK: '',
                DRAFT: "1",
            },
            ip,
        );

        if (!createForm?.status) {
            const errMsg =
                createForm?.message?.message ||
                createForm?.message ||
                'Unknown error';
            throw new Error(`Form creation failed: ${errMsg}`);
        }
        const form = {
            NFRMNO: createForm.data.NFRMNO,
            VORGNO: createForm.data.VORGNO,
            CYEAR: createForm.data.CYEAR,
            CYEAR2: createForm.data.CYEAR2,
            NRUNNO: createForm.data.NRUNNO,
        };

        await this.chkrepo.updateYearlyAssign(
            { ID: dto.ID, STATUS: 1 },
            { STATUS: 2 },
        );

        return this.chkrepo.insertYearlyForm({ ...dto, ...form });
    }

    async getYearlyResult(reportID: number) {
        return this.chkrepo.getYearlyResult(reportID);
    }

    async getYearlyForm(reportID: number) {
        return this.chkrepo.getYearlyForm(reportID);
    }
}
