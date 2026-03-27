import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PisService } from './pis.service';
import { PisController } from './pis.controller';
import { PrintedService } from './printed/printed.service';
import { FileLoggerModule } from 'src/common/services/file-logger/file-logger.module';

import { PisFiles } from 'src/common/Entities/workload/table/pis-files.entity';
import { PisPages } from 'src/common/Entities/workload/table/pis-pages.entity';
import { PisRepository } from './printed/pis.repository';

@Module({
    imports: [
        FileLoggerModule,
        TypeOrmModule.forFeature([PisFiles, PisPages], 'workloadConnection'),
    ],
    controllers: [PisController],
    providers: [PisService, PrintedService, PisRepository],
})
export class PisModule {}
