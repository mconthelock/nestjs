import { Module } from '@nestjs/common';
import { LabelconfirmService } from './labelconfirm.service';
import { LabelconfirmController } from './labelconfirm.controller';
import { LabelconfirmRepository } from './labelconfirm.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KITTING_EVENT_LOG } from 'src/common/Entities/workload/views/V_KITTING_EVENT_LOG.entity';
import { KITTING_LABEL } from '../../common/Entities/workload/table/KITTING_LABEL.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
        KITTING_EVENT_LOG,
        KITTING_LABEL,
    ], 'mitsuConnection'),
    ],
    controllers: [LabelconfirmController],
    providers: [LabelconfirmService, LabelconfirmRepository],
})
export class LabelconfirmModule {}
