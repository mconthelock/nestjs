import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FormModule } from 'src/webform/form/form.module';
import { FormmstModule } from 'src/webform/formmst/formmst.module';
import { PurVmmService } from './pur-vmm.service';
import { PurVmmController } from './pur-vmm.controller';
import { PurvmmScmusrModule } from './purvmm_scmusr/purvmm_scmusr.module';
import { PurvmmFormModule } from './purvmm_form/purvmm_form.module';
import { PurevaFormModule } from '../pur-eva/pureva_form/pureva_form.module';
import { PurvmmFormService } from './purvmm_form/purvmm_form.service';
import { PurnvfAddressRepository } from '../pur-nvf/purnvf_address/purnvf_address.repository';
import { FormCreateService } from 'src/webform/form/create-form.service';
import { PurvmmFormRepository } from './purvmm_form/purvmm_form.repository';
import { Vendors } from 'src/common/Entities/pursys/table/VENDORS.entity';
import { PurFileService } from '../pur-file/pur-file.service';
import { PurFileModule } from '../pur-file/pur-file.module';
import { PurFileRepository } from '../pur-file/pur-file.repository';

@Module({
    controllers: [PurVmmController],
    providers: [
        PurVmmService,
        PurvmmFormService, // <--- ต้องมีตัวนี้อยู่ใน providers
        PurnvfAddressRepository,
        PurvmmFormRepository,
        PurFileService,
        PurFileRepository,
    ],
    imports: [
        PurvmmScmusrModule,
        PurvmmFormModule,
        PurevaFormModule,
        FormModule,
        FormmstModule,
        PurFileModule,
        TypeOrmModule.forFeature([Vendors], 'purConnection'),
    ],
})
export class PurVmmModule {}
