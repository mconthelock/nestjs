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
}
