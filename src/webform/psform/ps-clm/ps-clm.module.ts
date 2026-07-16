import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PSCLM_DETAIL } from 'src/common/Entities/webform/table/PSCLM_DETAIL.entity';
import { PSCLM_FORM } from 'src/common/Entities/webform/table/PSCLM_FORM.entity';
import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { UsersModule } from 'src/amec/users/users.module';
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
    ],
    controllers: [PsClmController],
    providers: [PsClmService, PsClmRepository],
    exports: [PsClmService],
})
export class PsClmModule {}
