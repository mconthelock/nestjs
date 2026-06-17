import { Injectable } from '@nestjs/common';
import { CreateCheckinventoryDto } from './dto/create-checkinventory.dto';
import { UpdateCheckinventoryDto } from './dto/update-checkinventory.dto';
import { CheckinventoryRepository } from './checkinventory.repository';

@Injectable()
export class CheckinventoryService {
    constructor(private readonly chkrepo: CheckinventoryRepository) {}

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
        formData: { NFRMNO: number; VORGNO: string; CYEAR: string; CYEAR2: string; NRUNNO: number },
    ) {
        const REPORT_ID = await this.chkrepo.createHalfyearReport(empno, periods);
        await this.chkrepo.insertPscihForm({ ...formData, REPORT_ID });
        return { REPORT_ID };
    }
}
