import { Module } from '@nestjs/common';
import { StInpService } from './st-inp.service';
import { StInpController } from './st-inp.controller';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { StyImageModule } from 'src/gpreport/sty-image/sty-image.module';
import { StyTypeModule } from 'src/gpreport/sty-type/sty-type.module';
import { StyPatrolModule } from 'src/gpreport/sty-patrol/sty-patrol.module';
import { StInpCreateService } from './st-inp-create.service';
import { FlowModule } from 'src/webform/flow/flow.module';
import { StInpCorrectiveService } from './st-inp-corrective.service';

@Module({
    imports: [
        FormModule,
        FormmstModule,
        FlowModule,
        StyImageModule,
        StyTypeModule,
        StyPatrolModule,
    ],
    controllers: [StInpController],
    providers: [StInpService, StInpCreateService, StInpCorrectiveService],
    exports: [StInpService],
})
export class StInpModule {}
