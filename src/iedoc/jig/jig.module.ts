import { FlowModule } from 'src/webform/flow/flow.module';
import { JigFlowService } from './jig-flow.service';
import { Module } from '@nestjs/common';
import { MailModule } from 'src/common/services/mail/mail.module';
import { JigReminderService } from './jig-reminder.service';
import { FormModule } from 'src/webform/form/form.module';
import { JigInspectionService } from './jig-inspection.service';
import { JigNgTagService } from './jig-ng-tag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JigController } from './jig.controller';
import { JigService } from './jig.service';
import { JigRepository } from './jig.repository';
import { JigMaster } from 'src/common/Entities/iedoc/table/jig_master.entity';
import { JigDelForm } from 'src/common/Entities/iedoc/table/jigdel_form.entity';
import { JigDefectNg } from 'src/common/Entities/iedoc/table/jig_defect_ng.entity';
import { JigCheckpoint } from 'src/common/Entities/iedoc/table/jig_checkpoint.entity';
import { JigForm } from 'src/common/Entities/iedoc/table/jig_form.entity';
import { JigFormDetail } from 'src/common/Entities/iedoc/table/jig_form_detail.entity';
import { JigFormNg } from 'src/common/Entities/iedoc/table/jig_form_ng.entity';
import { JigFormFile } from 'src/common/Entities/iedoc/table/jig_form_file.entity';
import { MachineAbilityProcess } from 'src/common/Entities/iedoc/table/machine_ability_process.entity';
import { ShopCodeMst } from 'src/common/Entities/iedoc/table/shopcodemst.entity';
@Module({
    imports: [
        FlowModule,
        MailModule,
        FormModule,
        TypeOrmModule.forFeature(
            [
                JigMaster,
                JigDelForm,
                JigDefectNg,
                JigCheckpoint,
                JigForm,
                JigFormDetail,
                JigFormNg,
                JigFormFile,
                MachineAbilityProcess,
                ShopCodeMst,
            ],
            'iedocConnection',
        ),
    ],
    controllers: [JigController],
    providers: [JigFlowService, JigService, JigRepository, JigInspectionService, JigNgTagService, JigReminderService],
    exports: [JigService, JigRepository],
})
export class JigModule {}
