import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { ReportMaster } from 'src/common/Entities/webform/table/REPORT_MASTER.entity';

import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(ReportMaster, 'webformConnection')
        private readonly report: Repository<ReportMaster>,
    ) {}

    async create(createReportDto: CreateReportDto) {
        const report = this.report.create(createReportDto);
        return this.report.save(report);
    }

    findAll() {
        return this.report.find();
    }

    findOne(id: number) {
        return this.report.findOne({ where: { ID: id } });
    }

    async update(id: number, updateReportDto: UpdateReportDto) {
        await this.report.update({ ID: id }, updateReportDto);
        return this.report.findOne({ where: { ID: id } });
    }

    async remove(id: number) {
        const report = await this.report.findOne({ where: { ID: id } });
        if (report) {
            await this.report.remove(report);
        }
        return report;
    }
}
