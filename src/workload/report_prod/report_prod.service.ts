import { Injectable } from '@nestjs/common';
import { CreateReportProdDto } from './dto/create-report_prod.dto';
import { UpdateReportProdDto } from './dto/update-report_prod.dto';
import { ReportProdRepository } from './report_prod.repository';

@Injectable()
export class ReportProdService {
    constructor(private readonly reportProdRepository: ReportProdRepository) {}

    getOutputProdHistory(startMonth: string, endMonth: string) {
        return this.reportProdRepository.getOutputProdHistory(
            startMonth,
            endMonth,
        );
    }
    getFinishProdHistory(startMonth: string, endMonth: string) {
        return this.reportProdRepository.getFinishProdHistory(
            startMonth,
            endMonth,
        );
    }

    getCountFinishDelayHistory(startMonth: string, endMonth: string) {
        return this.reportProdRepository.getCountFinishDelayHistory(
            startMonth,
            endMonth,
        );
    }
}
