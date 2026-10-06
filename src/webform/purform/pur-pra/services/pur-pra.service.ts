import { Injectable } from '@nestjs/common';
import { CommitteeRepository } from '../repository/committe.repository';
import { GroupRepository } from '../repository/group.repository';
import { ReasonsRepository } from '../repository/reasons.repository';

@Injectable()
export class PurPraService {
    constructor(
        private readonly committeeRepo: CommitteeRepository,
        private readonly groupRepo: GroupRepository,
        private readonly reasonsRepo: ReasonsRepository,
    ) {}

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-05
     * @description ดึงข้อมูลคณะกรรมการทั้งหมด
     * @returns 
     */
    async getCommittees() {
        try {
            const res = await this.committeeRepo.findAll();
            return res.length == 0
                ? {
                      status: false,
                      message: 'No committees found',
                  }
                : {
                      status: true,
                      message: `Committees found ${res.length} records`,
                      data: res,
                  };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-05
     * @description ดึงข้อมูลกลุ่มทั้งหมด
     * @returns 
     */
    async getGroups() {
        try {
            const res = await this.groupRepo.findAll();
            return res.length == 0
                ? {
                      status: false,
                      message: 'No groups found',
                  }
                : {
                      status: true,
                      message: `Groups found ${res.length} records`,
                      data: res,
                  };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-06
     * @description ดึงข้อมูลเหตุผลตามกลุ่ม
     * @param groupCode รหัสกลุ่ม
     * @returns 
     */
    async getReasonsByGroup(groupCode: string) {
        try {
            const res = await this.reasonsRepo.findByGroup(groupCode);
            return res.length == 0
                ? {
                      status: false,
                      message: `No reasons found for group ${groupCode}`,
                  }
                : {
                      status: true,
                      message: `Reasons found for group ${groupCode} ${res.length} records`,
                      data: res,
                  };
        } catch (error) {
            throw error;
        }
    }
}
