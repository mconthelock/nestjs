import { PilineRejectFilesController } from './PILINE_REJECT_FILES.controller';
import { FlowModule } from 'src/webform/flow/flow.module';
import { OrgposModule } from 'src/webform/orgpos/orgpos.module';
import { RepModule } from 'src/webform/rep/rep.module';
import { UsersModule } from 'src/amec/users/users.module';
import { PilineRejectDetailsService } from './PILINE_REJECT_DETAILS.service';
import { PilineRejectFlowService } from './PILINE_REJECT_FLOW.service';
import { PilineRejectRequestController, PilineRejectRequestService } from './PILINE_REJECT_REQUEST.controller';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { PilineIssueController } from './PILINE_ISSUE.controller';
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
        FlowModule, OrgposModule, RepModule, UsersModule,
        ConectionModule,
        TypeOrmModule.forFeature([PILINE_EVENT_RECORD], 'workloadConnection'),
    ],
    controllers: [PilineRejectFilesController, PilineRejectRequestController, PilineIssueController, PilineEventRecordController, PilineEventInputController, PilineIdtagController],
    providers: [
        PilineRejectDetailsService, PilineRejectFlowService, PilineRejectRequestService,
        PilineEventRecordService,
        PilineEventRecordRepository,
        PilineEventInputService,
        PilineEventFilesService,
        PilineIdtagService,
    ],
    exports: [PilineEventRecordService],
})
export class PilineEventRecordModule {}

