import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PSCLM_DETAIL } from 'src/common/Entities/webform/table/PSCLM_DETAIL.entity';
import { PSCLM_FORM } from 'src/common/Entities/webform/table/PSCLM_FORM.entity';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { UsersModule } from 'src/amec/users/users.module';
import { ConectionModule } from 'src/as400/conection/conection.module';
import { M001kpModule } from 'src/as400/rtnlibf/m001kp/m001kp.module';
import { M002kpModule } from 'src/as400/rtnlibf/m002kp/m002kp.module';
import { MailModule } from 'src/common/services/mail/mail.module';
import { HandleFileFormModule } from 'src/webform/handle-file-form/handle-file-form.module';
import { PsClmController } from './ps-clm.controller';
import { PsClmRepository } from './ps-clm.repository';
import { PsClmService } from './ps-clm.service';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [PSCLM_FORM, PSCLM_DETAIL],
            'webformConnection',
        ),
        FormmstModule,
        FormModule,
        FlowModule,
        UsersModule,
        ConectionModule,
        M001kpModule,
        M002kpModule,
        MailModule,
        HandleFileFormModule,
    ],
    controllers: [PsClmController],
    providers: [PsClmService, PsClmRepository],
    exports: [PsClmService],
})
export class PsClmModule {}
