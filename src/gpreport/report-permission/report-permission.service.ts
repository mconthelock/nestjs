import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

import { CreateReportPermissionDto } from './dto/create-report-permission.dto';
import { UpdateReportPermissionDto } from './dto/update-report-permission.dto';

import { ReportPermission } from 'src/common/Entities/gpreport/table/REPORT_PERMISSION.entity';

@Injectable()
export class ReportPermissionService {
    constructor(
        @InjectRepository(ReportPermission, 'gpreportConnection')
        private readonly repo: Repository<ReportPermission>,
    ) {}

    findAll() {
        return this.repo.find();
    }

    findOne(id: string) {
        return this.repo.findOne({ where: { USERS: id } });
    }

    create(createReportPermissionDto: CreateReportPermissionDto) {
        return this.repo.save(createReportPermissionDto);
    }

    update(id: string, updateReportPermissionDto: UpdateReportPermissionDto) {
        return this.repo.update({ USERS: id }, updateReportPermissionDto);
    }

    remove(id: string) {
        return this.repo.delete({ USERS: id });
    }
}
