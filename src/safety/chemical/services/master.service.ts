import { Injectable } from '@nestjs/common';
import { OwnOrgDto } from '../dto/master.dto';

import { MasterRepository } from '../repository/master.repository';
import { RevRepository } from '../repository/rev.repository';

import { SequenceOrgService } from 'src/webform/sequence-org/sequence-org.service';
import { OrganizationsService } from 'src/webform/organizations/organizations.service';

import { SEQUENCEORG } from 'src/common/Entities/webform/table/SEQUENCEORG.entity';

@Injectable()
export class MasterService {
    constructor(
        private readonly masterRepo: MasterRepository,
        private readonly revRepo: RevRepository,
        private readonly sequenceOrgService: SequenceOrgService,
        private readonly orgService: OrganizationsService,
    ) {}

    async getActive() {
        const section = await this.revRepo.getSectionActive();
        return { data: await this.masterRepo.getMaster(section, 1), section };
    }

    async getInactive() {
        const section = await this.revRepo.getSectionActive();
        return { data: await this.masterRepo.getMaster(section, 0), section };
    }

    async getOwnOrg(data: OwnOrgDto) {
        try {
            const { EMPNO, GROUP } = data;

            if (['ADM', 'DEV'].includes(GROUP)) {
                const master = await this.getActive();
                return {
                    status: true,
                    ...master,
                };
            }

            const org = await this.orgService.getOrgTreeWithEmp(EMPNO);
            if (!org.status) {
                throw new Error(org.message);
            }
            for (const o of org.data) {
                
            }
            return {
                status: true,
                data: org.data,
            };
        } catch (error) {
            throw error;
        }
    }
}
