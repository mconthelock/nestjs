import { PilineIdtagController, PilineIdtagService } from './PILINE_IDTAG.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PILINE_EVENT_RECORD } from 'src/common/Entities/workload/table/PILINE_EVENT_RECORD.entity';
import { PilineEventRecordController } from './PILINE_EVENT_RECORD.controller';
import { PilineEventRecordService } from './PILINE_EVENT_RECORD.service';
import { PilineEventRecordRepository } from './PILINE_EVENT_RECORD.repository';
import { PilineEventInputController } from './PILINE_EVENT_INPUT.controller';
import { PilineEventInputService } from './PILINE_EVENT_INPUT.service';
import { PilineEventFilesService } from './PILINE_EVENT_FILES.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([PILINE_EVENT_RECORD], 'workloadConnection'),
    ],
    controllers: [PilineEventRecordController, PilineEventInputController, PilineIdtagController],
    providers: [
        PilineEventRecordService,
        PilineEventRecordRepository,
        PilineEventInputService,
        PilineEventFilesService,
        PilineIdtagService,
    ],
    exports: [PilineEventRecordService],
})
export class PilineEventRecordModule {}
