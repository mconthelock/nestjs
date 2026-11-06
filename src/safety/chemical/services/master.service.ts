import { Injectable } from '@nestjs/common';
import { OwnOrgDto } from '../dto/master.dto';

import { MasterRepository } from '../repository/master.repository';
import { RevRepository } from '../repository/rev.repository';
import { SectionRepository } from '../repository/section.repository';

import { OrganizationsService } from 'src/webform/organizations/organizations.service';

@Injectable()
export class MasterService {
    constructor(
        private readonly orgService: OrganizationsService,
        private readonly masterRepo: MasterRepository,
        private readonly revRepo: RevRepository,
        private readonly sectionRepo: SectionRepository,
    ) {}

    async getActive() {
        const section = await this.revRepo.getSectionActive();
        return { section, data: await this.masterRepo.getMaster(section, 1) };
    }

    async getInactive() {
        const section = await this.revRepo.getSectionActive();
        return { section, data: await this.masterRepo.getMaster(section, 0) };
    }

    async getOwnOrg(dto: OwnOrgDto) {
        try {
            const { EMPNO, GROUP } = dto;

            if (['ADM', 'DEV'].includes(GROUP)) {
                const master = await this.getActive();
                const masterData = await this.revRepo.getMaster();
                return {
                    status: true,
                    master: masterData,
                    ...master,
                };
            }

            const org = await this.orgService.getOrgTreeWithEmp(EMPNO, true);
            if (!org.status) {
                throw new Error(org.message);
            }
            let data = {};
            for (const o of org.data) {
                const masters = await this.sectionRepo.getMasterSection(o.CODE);
                if (masters && masters.length > 0) {
                    data[o.NAME] = masters;
                }
            }
            return {
                status: true,
                organizations: org.data,
                data,
            };
        } catch (error) {
            throw error;
        }
    }
}
