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
import { SequenceOrgModule } from 'src/webform/sequence-org/sequence-org.module';
import { OrganizationsModule } from 'src/webform/organizations/organizations.module';

@Module({
    imports: [
        ChemicalSectionModule,
        FormModule,
        SequenceOrgModule,
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
    ],
})
export class SafetyChemicalModule {}
