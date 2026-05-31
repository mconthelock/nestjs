import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GpRbService } from './gp-rb.service';
import { GpRbController } from './gp-rb.controller';
import { GpRbRepository } from './gp-rb.repository';

import { FormmstModule } from 'src/webform/center/formmst/formmst.module';
import { FormModule } from 'src/webform/center/form/form.module';
import { FlowModule } from 'src/webform/center/flow/flow.module';
import { HandleFileFormModule } from 'src/webform/center/handle-file-form/handle-file-form.module';

import { GPRB_PURPOSE } from 'src/common/Entities/webform/table/GPRB_PURPOSE.entity';
import { GPRB_STAMP_CONFIG } from 'src/common/Entities/webform/table/GPRB_STAMP_CONFIG.entity';
import { GPRB_STAMP_REQ } from 'src/common/Entities/webform/table/GPRB_STAMP_REQ.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature(
            [GPRB_PURPOSE, GPRB_STAMP_CONFIG, GPRB_STAMP_REQ],
            'webformConnection',
        ),
        FormmstModule,
        FormModule,
        FlowModule,
        HandleFileFormModule,
    ],
    controllers: [GpRbController],
    providers: [GpRbService, GpRbRepository],
    exports: [GpRbService],
})
export class GpRbModule {}

// สำหรับดึงข้อมูลแสดงในหน้า show-gp-rb by Plankton
// @Module({
//     imports: [
//         TypeOrmModule.forFeature([RB_STAMP_REQ], 'webformConnection'),
//         FlowModule,
//     ],
//     controllers: [ShowstampGpRbController],
//     providers: [ShowstampGpRbService, ShowstampGpRbRepository],
//     exports: [ShowstampGpRbService],
// })
// export class ShowstampGpRbModule {}

// สำหรับดึงข้อมูลแสดงในหน้า show-cus-stamp-gp-rb by Plankton
// @Module({
//     imports: [
//         TypeOrmModule.forFeature([RB_CUS_STAMP_REQ], 'webformConnection'),
//     ],
//     controllers: [ShowCusStampGpRbController],
//     providers: [ShowCusstampGpRbService, ShowCusStampGpRbRepository],
//     exports: [ShowCusstampGpRbService],
// })
// export class ShowCusStampGpRbModule {}
