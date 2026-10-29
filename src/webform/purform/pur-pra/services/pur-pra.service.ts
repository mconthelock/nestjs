import { Injectable } from '@nestjs/common';
import { CommitteeRepository } from '../repository/committe.repository';
import { GroupRepository } from '../repository/group.repository';
import { ReasonsMasterRepository } from '../repository/reasons-master.repository';
import { FormDto } from 'src/webform/form/dto/form.dto';
import { FormRepository } from '../repository/form.repository';
import { KeyLinkRepository } from '../repository/keyLink.repository';
import { KeyLinkDto } from '../dto/key-link.dto';

@Injectable()
export class PurPraService {
    constructor(
        private readonly committeeRepo: CommitteeRepository,
        private readonly groupRepo: GroupRepository,
        private readonly reasonsRepo: ReasonsMasterRepository,
        private readonly purPraFormRepo: FormRepository,
        private readonly keyLinkRepo: KeyLinkRepository,
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

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-13
     * @description ดึงข้อมูลแบบฟอร์ม Price Approval
     * @param form
     * @returns
     */
    async getPurPraForms(form: FormDto) {
        try {
            const res = await this.purPraFormRepo.findByForm(form);
            return !res
                ? {
                      status: false,
                      message: 'No price Approval form found',
                  }
                : {
                      status: true,
                      message: `Price Approval form found`,
                      data: res,
                  };
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-21
     * @description ดึงข้อมูล Key Link
     * @param data
     * @returns
     */
    async keyLink(data: KeyLinkDto) {
        try {
            const res = await this.keyLinkRepo.findOne(data);
            return !res
                ? {
                      status: false,
                      message: 'No key link found',
                  }
                : {
                      status: true,
                      message: `Key link found`,
                      data: res,
                  };
        } catch (error) {
            throw error;
        }
    }
}
