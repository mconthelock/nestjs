import { Injectable, NotFoundException } from '@nestjs/common';
import { OwnOrgDto } from '../dto/master.dto';

import { MasterRepository } from '../repository/master.repository';
import { RevRepository } from '../repository/rev.repository';
import { SectionRepository } from '../repository/section.repository';

import { OrganizationsService } from 'src/webform/organizations/organizations.service';
import { FileRepository } from '../repository/file.repository';
import { StyFilesService } from 'src/gpreport/sty-files/sty-files.service';

@Injectable()
export class MasterService {
    constructor(
        protected readonly orgService: OrganizationsService,
        protected readonly masterRepo: MasterRepository,
        protected readonly revRepo: RevRepository,
        protected readonly sectionRepo: SectionRepository,
        protected readonly fileRepo: FileRepository,
        protected readonly styFilesService: StyFilesService,
    ) {}

    /**
     * @author Sutthipong tangmongkhoncharoen(24008)
     * @since 2026-11-09
     * @description ดึงข้อมูล master ที่ active ทั้งหมด
     * @returns ข้อมูล master ที่ active ทั้งหมด
     */
    async getActive() {
        try {
            const section = await this.revRepo.getSectionActive();
            // const data = await this.masterRepo.getMaster(section, 1);
            const data = await this.masterRepo.getMasters({ status: 1 });
            return {
                status: true,
                message: `Data master found ${data.length} record`,
                section,
                data,
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong tangmongkhoncharoen(24008)
     * @since 2026-11-09
     * @description ดึงข้อมูล master ที่ inactive ทั้งหมด
     * @returns ข้อมูล master ที่ inactive ทั้งหมด
     */
    async getInactive() {
        try {
            const section = await this.revRepo.getSectionActive();
            // const data = await this.masterRepo.getMaster(section, 0);
            const data = await this.masterRepo.getMasters({ status: 0 });

            return {
                status: true,
                message: `Data master found ${data.length} record`,
                section,
                data,
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong tangmongkhoncharoen(24008)
     * @since 2026-11-09
     * @description ดึงข้อมูล master แต่ละแผนกของผู้ใช้งาน
     * @returns ข้อมูล master แต่ละแผนกของผู้ใช้งาน
     */
    async getOwnOrg(dto: OwnOrgDto) {
        try {
            const { EMPNO, GROUP } = dto;

            if (['ADM', 'DEV'].includes(GROUP)) {
                const master = await this.getActive();
                if (!master.status) {
                    throw new Error(master.message);
                }
                const masterData = await this.revRepo.getMaster();
                return {
                    status: true,
                    master: masterData,
                    section: master.section,
                    data: master.data,
                };
            }

            const org = await this.orgService.getOrgTreeWithEmp(EMPNO, true);
            if (!org.status) {
                throw new Error(org.message);
            }
            const ownerCode = org.data.map((o) => o.CODE);
            const organization = await this.revRepo.getByCode(ownerCode);
            let data = {};
            for (const o of org.data) {
                const masters = await this.sectionRepo.getMasterSection(o.CODE);
                if (masters && masters.length > 0) {
                    data[o.NAME] = masters;
                }
            }
            return {
                status: true,
                organizations: organization,
                data,
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong tangmongkhoncharoen(24008)
     * @since 2026-11-13
     * @description ปิดการใช้งาน master และ section ที่เกี่ยวข้องตาม ID
     * @returns ผลลัพธ์การปิดการใช้งาน master และ section
     */
    async disableMaster(id: number, userUpdate: string) {
        try {
            await this.masterRepo.disable(id, userUpdate);
            await this.sectionRepo.disableById(id, userUpdate);
            const files = await this.fileRepo.getByChemicalId(id);
            if (files && files.length > 0) {
                for(const file of files) {
                    await this.styFilesService.disable(file.FILE_ID, userUpdate);
                }
            }
            return {
                status: true,
                message: 'Disable successfully',
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong tangmongkhoncharoen(24008)
     * @since 2026-11-25
     * @description ดึงรายชื่อผู้จัดการที่รับอีเมลของสารเคมีตาม ID
     * @param id รหัสสารเคมี
     * @returns รายชื่อผู้จัดการที่รับอีเมลของสารเคมี
     */
    async getMailManagerbyId(id: number) {
        try {
            const res = await this.sectionRepo.getMailManagerbyId(id);
            if(!res || res.length === 0) {
                throw new NotFoundException(`Mail manager not found form id ${id}`);
            }
            return {
                status: true,
                data: res,
            };
        } catch (error) {
            throw error;
        }
    }
}
