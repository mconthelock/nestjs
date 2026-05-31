import { Module } from '@nestjs/common';
import { HandleFileFormService } from './handle-file-form.service';
import { HandleFileFormController } from './handle-file-form.controller';
import { FormmstModule } from 'src/webform/center/formmst/formmst.module';
import { FormModule } from 'src/webform/center/form/form.module';
import { GpFileModule } from '../../gpform/gp-file/gp-file.module';
import { IsFileModule } from '../../isform/is-file/is-file.module';
import { PurFileModule } from '../../purform/pur-file/pur-file.module';
import { FinFileModule } from '../../finform/fin-file/fin-file.module';
import { FormAttachmentTypeModule } from 'src/webform/center/form-attachment-type/form-attachment-type.module';
import { IeFileModule } from '../../ieform/ie-file/ie-file.module';
import { FeFileModule } from '../../feform/fe-file/fe-file.module';
import { MarFileModule } from '../../marform/mar-file/mar-file.module';
import { MfgFileModule } from '../../mfgform/mfg-file/mfg-file.module';
import { PsFileModule } from '../../psform/ps-file/ps-file.module';

@Module({
    imports: [
        FormmstModule,
        FormModule,
        FeFileModule,
        FinFileModule,
        GpFileModule,
        IeFileModule,
        IsFileModule,
        MarFileModule,
        MfgFileModule,
        PsFileModule,
        PurFileModule,
        FormAttachmentTypeModule,
    ],
    controllers: [HandleFileFormController],
    providers: [HandleFileFormService],
    exports: [HandleFileFormService],
})
export class HandleFileFormModule {}
