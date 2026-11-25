import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChemicalSectionModule } from './chemical-section/chemical-section.module';
import { FormModule } from 'src/webform/form/form.module';
import { StyFilesModule } from 'src/gpreport/sty-files/sty-files.module';
import { OrganizationsModule } from 'src/webform/organizations/organizations.module';

import { FollowController } from './controllers/follow.controller';
import { MasterController } from './controllers/master.controller';
import { FollowService } from './services/follow.service';
import { RevController } from './controllers/rev.controller';

import { FollowRepository } from './repository/follow.repository';
import { MasterRepository } from './repository/master.repository';
import { RevRepository } from './repository/rev.repository';
import { SectionRepository } from './repository/section.repository';

import { MasterService } from './services/master.service';
import { RevService } from './services/rev.service';
import { RebuildService } from './services/rebuild.service';
import { CreateService } from './services/create.service';

import { STY_CHEMICAL_FORM } from 'src/common/Entities/gpreport/table/STY_CHEMICAL_FORM.entity';
import { STY_CHEMICAL } from 'src/common/Entities/gpreport/table/STY_CHEMICAL.entity';
import { STY_CHEMICAL_REV } from 'src/common/Entities/gpreport/table/STY_CHEMICAL_REV.entity';
import { STY_CHM_SEC } from 'src/common/Entities/gpreport/views/STY_CHM_SEC.entity';
import { STY_CHEMICAL_SECTION } from 'src/common/Entities/gpreport/table/STY_CHEMICAL_SECTION.entity';
import { FileRepository } from './repository/file.repository';
import { MailModule } from 'src/common/services/mail/mail.module';

@Module({
    imports: [
        TypeOrmModule.forFeature(
            [
                STY_CHEMICAL,
                STY_CHEMICAL_SECTION,
                STY_CHEMICAL_FORM,
                STY_CHEMICAL_REV,
                STY_CHM_SEC,
            ],
            'gpreportConnection',
        ),
        ChemicalSectionModule,
        FormModule,
        OrganizationsModule,
        StyFilesModule,
        MailModule,
    ],
    controllers: [FollowController, MasterController, RevController],
    providers: [
        // Services
        FollowService,
        MasterService,
        RevService,
        RebuildService,
        CreateService,

        // Repository
        FollowRepository,
        MasterRepository,
        RevRepository,
        SectionRepository,
        FileRepository,
    ],
})
export class SafetyChemicalModule {}
