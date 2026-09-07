import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { UsersService } from 'src/amec/users/users.service';

import { ReportMaster } from 'src/common/Entities/webform/table/REPORT_MASTER.entity';
import { ReportMasterAuth } from 'src/common/Entities/webform/table/REPORT_MASTER_AUTH.entity';

import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { CreateReportAuthDto } from './dto/create-auth.dto';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(ReportMaster, 'webformConnection')
        private readonly report: Repository<ReportMaster>,
        @InjectRepository(ReportMasterAuth, 'webformConnection')
        private readonly reportAuth: Repository<ReportMasterAuth>,
        private readonly usr: UsersService,
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

    //Auth
    async findAuth(id: number) {
        const users = await this.usr.search({ CSTATUS: '1' });
        const reportAuths = await this.reportAuth.find({
            where: { REPORT: id },
        });
        return users.map((user) => {
            const userAuth = reportAuths.filter(
                (a) => a.VEMPNO === user.SEMPNO,
            );
            return {
                ...user,
                auth: userAuth,
            };
        });
    }

    findAuthUser(userId: string) {
        return this.reportAuth.find({ where: { VEMPNO: userId } });
    }

    async updateAuth(updateReportAuthDto: CreateReportAuthDto) {
        await this.reportAuth.update(
            {
                REPORT: updateReportAuthDto.REPORT,
                VEMPNO: updateReportAuthDto.VEMPNO,
            },
            updateReportAuthDto,
        );
        return this.reportAuth.findOne({
            where: {
                REPORT: updateReportAuthDto.REPORT,
                VEMPNO: updateReportAuthDto.VEMPNO,
            },
        });
    }
}
