import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/amec/users/users.module';

import { ReportService } from './report.service';
import { ReportController } from './report.controller';

import { ReportMaster } from 'src/common/Entities/webform/table/REPORT_MASTER.entity';
import { ReportMasterAuth } from 'src/common/Entities/webform/table/REPORT_MASTER_AUTH.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [ReportMaster, ReportMasterAuth],
            'webformConnection',
        ),
        UsersModule,
    ],
    controllers: [ReportController],
    providers: [ReportService],
})
export class ReportModule {}
