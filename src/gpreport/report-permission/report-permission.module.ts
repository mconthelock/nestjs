import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportPermissionService } from './report-permission.service';
import { ReportPermissionController } from './report-permission.controller';
import { ReportPermission } from 'src/common/Entities/gpreport/table/REPORT_PERMISSION.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([ReportPermission], 'gpreportConnection'),
    ],
    controllers: [ReportPermissionController],
    providers: [ReportPermissionService],
})
export class ReportPermissionModule {}
