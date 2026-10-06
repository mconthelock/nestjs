import { Module } from '@nestjs/common';
import { FlowmstService } from './flowmst.service';
import { FlowmstController } from './flowmst.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowmstRepository } from './flowmst.repository';
import { FLOWMST } from 'src/common/Entities/webform/table/FLOWMST.entity';
import { STEPMST } from 'src/common/Entities/webform/table/STEPMST.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([FLOWMST, STEPMST], 'webformConnection'),
    ],
    controllers: [FlowmstController],
    providers: [FlowmstService, FlowmstRepository],
    exports: [FlowmstService],
})
export class FlowmstModule {}
