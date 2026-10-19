import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PILINE_EVENT_MST } from 'src/common/Entities/workload/table/PILINE_EVENT_MST.entity';
import { PilineEventMstController } from './PILINE_EVENT_MST.controller';
import { PilineEventMstService } from './PILINE_EVENT_MST.service';
import { PilineEventMstRepository } from './PILINE_EVENT_MST.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([PILINE_EVENT_MST], 'workloadConnection'),
    ],
    controllers: [PilineEventMstController],
    providers: [PilineEventMstService, PilineEventMstRepository],
    exports: [PilineEventMstService],
})
export class PilineEventMstModule {}
