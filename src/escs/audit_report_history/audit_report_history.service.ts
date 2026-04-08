import { Injectable } from '@nestjs/common';
import { CreateAuditReportHistoryDto } from './dto/create-audit_report_history.dto';
import { AuditReportHistoryRepository } from './audit_report_history.repository';

@Injectable()
export class AuditReportHistoryService {
    constructor(private readonly repo: AuditReportHistoryRepository) {}

    async create(dto: CreateAuditReportHistoryDto) {
        try {
            await this.repo.insert(dto);
            return {
                status: true,
                message: 'Insert history Successfully',
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}
