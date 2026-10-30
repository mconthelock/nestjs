import { Module } from '@nestjs/common';
import { ChemicalSectionModule } from './chemical-section/chemical-section.module';
import { FormModule } from 'src/webform/form/form.module';

import { FollowController } from './controllers/follow.controller';
import { FollowService } from './services/follow.service';
import { FollowRepository } from './repository/follow.repository';

import { MasterController } from './controllers/master.controller';
import { MasterRepository } from './repository/master.repository';
import { MasterService } from './services/master.service';
import { RevRepository } from './repository/rev.repository';
import { OrganizationsModule } from 'src/webform/organizations/organizations.module';
import { SectionRepository } from './repository/section.repository';

@Module({
    imports: [
        ChemicalSectionModule,
        FormModule,
        OrganizationsModule,
    ],
    controllers: [FollowController, MasterController],
    providers: [
        // Services
        FollowService,
        MasterService,

        // Repository
        FollowRepository,
        MasterRepository,
        RevRepository,
        SectionRepository,
    ],
})
export class SafetyChemicalModule {}
