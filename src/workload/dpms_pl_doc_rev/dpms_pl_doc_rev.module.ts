import { Module } from '@nestjs/common';
import { DpmsPlDocRevService } from './dpms_pl_doc_rev.service';
import { DpmsPlDocRevController } from './dpms_pl_doc_rev.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DPMS_PL_DOC_REV } from 'src/common/Entities/workload/table/DPMS_PL_DOC_REV.entity';
import { DpmsPlDocRevRepository } from './dpms_pl_doc_rev.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([DPMS_PL_DOC_REV], 'workloadConnection'),
    ],
    controllers: [DpmsPlDocRevController],
    providers: [DpmsPlDocRevService, DpmsPlDocRevRepository],
    exports: [DpmsPlDocRevService],
})
export class DpmsPlDocRevModule {}
