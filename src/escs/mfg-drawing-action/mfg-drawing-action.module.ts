import { Module } from '@nestjs/common';
import { MfgDrawingActionService } from './mfg-drawing-action.service';
import { MfgDrawingActionController } from './mfg-drawing-action.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MFG_DRAWING_ACTION } from 'src/common/Entities/escs/table/MFG_DRAWING_ACTION.entity';
import { MfgDrawingActionRepository } from './mfg-drawing-action.repository';
import { SYS_STATUS } from 'src/common/Entities/escs/table/SYS_STATUS.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MFG_DRAWING_ACTION, SYS_STATUS], 'mitsuConnection')],
    controllers: [MfgDrawingActionController],
    providers: [MfgDrawingActionService, MfgDrawingActionRepository],
    exports: [MfgDrawingActionService],
})
export class MfgDrawingActionModule {}
