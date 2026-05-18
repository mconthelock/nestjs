import { Module } from '@nestjs/common';
import {
    GpRbService,
    ShowCusstampGpRbService,
    ShowstampGpRbService,
} from './gp-rb.service';
import {
    GpRbController,
    ShowCusStampGpRbController,
    ShowstampGpRbController,
} from './gp-rb.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    GpRbRepository,
    ShowCusStampGpRbRepository,
    ShowstampGpRbRepository,
} from './gp-rb.repository';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { FormModule } from 'src/webform/form/form.module';
import { RB_PURPOSE } from 'src/common/Entities/webform/table/GPRB_PURPOSE.entity';
import { RB_STAMP_REQ } from 'src/common/Entities/webform/table/GPRB_STAMP_REQ.entity';
import { RB_CUS_STAMP_REQ } from 'src/common/Entities/webform/table/GPRB_CUS_STAMP_REQ.entity';
import { HandleFileFormModule } from 'src/webform/handle-file-form/handle-file-form.module';
import { FlowModule } from 'src/webform/flow/flow.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([RB_PURPOSE], 'webformConnection'),
        FormmstModule,
        FormModule,
        HandleFileFormModule,
    ],
    controllers: [GpRbController],
    providers: [GpRbService, GpRbRepository],
    exports: [GpRbService],
})
export class GpRbModule {}

// สำหรับดึงข้อมูลแสดงในหน้า show-gp-rb by Plankton
@Module({
    imports: [
        TypeOrmModule.forFeature([RB_STAMP_REQ], 'webformConnection'),
        FlowModule,
    ],
    controllers: [ShowstampGpRbController],
    providers: [ShowstampGpRbService, ShowstampGpRbRepository],
    exports: [ShowstampGpRbService],
})
export class ShowstampGpRbModule {}

// สำหรับดึงข้อมูลแสดงในหน้า show-cus-stamp-gp-rb by Plankton
@Module({
    imports: [
        TypeOrmModule.forFeature([RB_CUS_STAMP_REQ], 'webformConnection'),
    ],
    controllers: [ShowCusStampGpRbController],
    providers: [ShowCusstampGpRbService, ShowCusStampGpRbRepository],
    exports: [ShowCusstampGpRbService],
})
export class ShowCusStampGpRbModule {}
