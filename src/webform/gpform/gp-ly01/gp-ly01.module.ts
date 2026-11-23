import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GpLy01Service } from './gp-ly01.service';
import { GpLy01Controller } from './gp-ly01.controller';
import { GpLy01Repository } from './gp-ly01.repository';
import { FormModule } from 'src/webform/form/form.module';
import { FlowModule } from 'src/webform/flow/flow.module';
import { EmptaxModule } from 'src/as400/datalibi/emptax/emptax.module';
import { FLOW } from 'src/common/Entities/webform/table/FINDS_Join.entity';
import { FORM } from 'src/common/Entities/webform/table/FORM.entity';
import { EMP03T } from 'src/common/Entities/webform/views/EMP03T.entity';
import { GPLY01_TAXAS400 } from 'src/common/Entities/webform/table/GPLY01_TAXAS400.entity';
import { GPLY01_TAX } from 'src/common/Entities/webform/table/GPLY01_TAX.entiry';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [GPLY01_TAX, GPLY01_TAXAS400, EMP03T, FORM, FLOW],
            'mitsuConnection',
        ),
        FormModule,
        FlowModule,
        EmptaxModule,
    ],
    controllers: [GpLy01Controller],
    providers: [GpLy01Service, GpLy01Repository],
})
export class GpLy01Module {}
