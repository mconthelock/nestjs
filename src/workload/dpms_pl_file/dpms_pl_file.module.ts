import { Module } from '@nestjs/common';
import { DpmsPlFileService } from './dpms_pl_file.service';
import { DpmsPlFileController } from './dpms_pl_file.controller';
import { DpmsPlFileRepository } from './dpms_pl_file.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PL_FILE } from 'src/common/Entities/workload/table/DPMS_PL_FILE.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DPMS_PL_FILE], 'workloadConnection')],
    controllers: [DpmsPlFileController],
    providers: [DpmsPlFileService, DpmsPlFileRepository],
    exports: [DpmsPlFileService],
})
export class DpmsPlFileModule {}
