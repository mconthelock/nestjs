import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportService } from './report.service';
import { ReportController } from './report.controller';

import { ReportMaster } from 'src/common/Entities/webform/table/REPORT_MASTER.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ReportMaster], 'webformConnection')],
    controllers: [ReportController],
    providers: [ReportService],
})
export class ReportModule {}
