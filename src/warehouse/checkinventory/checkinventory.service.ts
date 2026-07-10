import { Injectable } from '@nestjs/common';
import { CreateCheckinventoryDto } from './dto/create-checkinventory.dto';
import { UpdateYearlyDto } from './dto/update-yearly.dto';
import { CheckinventoryRepository } from './checkinventory.repository';
import { CreateYearlyFormDto } from './dto/create-yearlyform.dto';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { FormmstService } from 'src/webform/formmst/formmst.service';

@Injectable()
export class CheckinventoryService {
    constructor(
        private readonly chkrepo: CheckinventoryRepository,
        private readonly formCreateService: FormCreateService,
        private readonly formmstService: FormmstService,
    ) {}

    async getReport() {
        return this.chkrepo.getReportData();
    }

    async getReportAssign(REPORT_ID: number) {
        return this.chkrepo.getReportAssign(REPORT_ID);
    }

    async createHalfyearReport(empno: string, periods: string) {
        return this.chkrepo.createHalfyearReport(empno, periods);
    }

    async createReportWithForm(
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
        const REPORT_ID = await this.chkrepo.createHalfyearReport(
            empno,
            periods,
        );
        await this.chkrepo.insertPscihForm({ ...formData, REPORT_ID });
        return { REPORT_ID };
    }

    async createYearlyReport(YEAR: string, PERIOD: string, EMPNO: string) {
        return this.chkrepo.createYearlyReport(YEAR, PERIOD, EMPNO);
    }

    async updateYearlyReport(dto: UpdateYearlyDto) {
        return this.chkrepo.updateYearlyReport(dto);
    }

    async checkAllActualChecked(reportID: number) {
        return this.chkrepo.checkAllActualChecked(reportID);
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
        }
        return this.chkrepo.insertYearlyForm({ ...dto, ...form });
    }

    async getYearlyResult(reportID: number) {
        return this.chkrepo.getYearlyResult(reportID);
    }
}
