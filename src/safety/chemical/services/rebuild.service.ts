import { Injectable } from '@nestjs/common';

import { MasterRepository } from '../repository/master.repository';
import { RevRepository } from '../repository/rev.repository';
import { SectionRepository } from '../repository/section.repository';

import { OrganizationsService } from 'src/webform/organizations/organizations.service';
import { MasterService } from './master.service';

import { formatDate } from 'src/common/utils/dayjs.utils';

@Injectable()
export class RebuildService extends MasterService {
    constructor(
        protected readonly orgService: OrganizationsService,
        protected readonly masterRepo: MasterRepository,
        protected readonly revRepo: RevRepository,
        protected readonly sectionRepo: SectionRepository,
    ) {
        super(orgService, masterRepo, revRepo, sectionRepo);
    }

    /**
     * @author Sutthipong tangmongkhoncharoen(24008)
     * @since 2026-11-11
     * @description ดึงข้อมูลรายการเพื่อ rebuild sections ของ master ที่ระบุ
     * @param id รายการ ID ของ master ที่ต้องการ rebuild sections
     * @returns ข้อมูล master และ sections ที่จัดรูปแบบใหม่สำหรับการ rebuild
     */
    async getRebuildSection(id: number[]) {
        const data = await this.masterRepo.getMasters({ status: 0, id });
        if (data.length > 0) {
            const newData = this.setData(data);
            return {
                status: true,
                message: `Data master found ${newData.data.length} record`,
                section: newData.sections,
                data: newData.data,
            };
        }
        return {
            status: false,
            message: 'No data found to rebuild sections.',
        };
    }

    /**
     * @author Sutthipong tangmongkhoncharoen(24008)
     * @since 2026-11-11
     * @description จัดรูปแบบข้อมูล master และ sections ใหม่
     * @param data 
     * @returns 
     */
    private setData(data: any[]): { data: any[]; sections: any[] } {
        const sections = data
            .flatMap((item) =>
                item.SECTIONS.map((s) => ({
                    OWNER: s.OWNER,
                    OWNERCODE: s.OWNERCODE,
                })),
            )
            .filter(
                (v, i, a) =>
                    a.findIndex((t) => t.OWNERCODE === v.OWNERCODE) === i,
            );
        const newData = data.flatMap((item) => {
            if (item.SECTIONS.length === 0) {
                const sectionData = sections.map((section) => {
                    const hasSection = item.SECTIONS.some(
                        (s) => s.OWNERCODE === section.OWNERCODE,
                    );
                    return {
                        [section.OWNER]: hasSection ? 'Y' : 'N',
                    };
                });
                return {
                    AMEC_SDS_ID: item.AMEC_SDS_ID,
                    CHEMICAL_NAME: item.CHEMICAL_NAME,
                    PRODUCT_CODE: item.PRODUCT_CODE,
                    REV: item.REV,
                    RECEIVED_SDS_DATE: item.RECEIVED_SDS_DATE
                        ? formatDate(item.RECEIVED_SDS_DATE, 'DD-MMM-YY')
                        : '',
                    EFFECTIVE_DATE: item.EFFECTIVE_DATE
                        ? formatDate(item.EFFECTIVE_DATE, 'DD-MMM-YY')
                        : '',
                    USED_FOR: '',
                    USED_AREA: '',
                    KEEPING_POINT: '',
                    QTY: '',
                    CLASSNAME: item.UN_CLASS
                        ? item.CLASS.TYPE_NAME.replace('Class ', '')
                        : '',
                    ...sectionData.reduce(
                        (acc, cur) => ({ ...acc, ...cur }),
                        {},
                    ),
                };
            }
            return item.SECTIONS.map((s) => {
                const sectionData = sections.map((section) => {
                    const hasSection = s.OWNERCODE === section.OWNERCODE;
                    return {
                        [section.OWNER]: hasSection ? 'Y' : 'N',
                    };
                });
                return {
                    AMEC_SDS_ID: item.AMEC_SDS_ID,
                    CHEMICAL_NAME: item.CHEMICAL_NAME,
                    PRODUCT_CODE: item.PRODUCT_CODE,
                    REV: item.REV,
                    RECEIVED_SDS_DATE: s.RECEIVED_SDS_DATE
                        ? formatDate(s.RECEIVED_SDS_DATE, 'DD-MMM-YY')
                        : '',
                    EFFECTIVE_DATE: item.EFFECTIVE_DATE
                        ? formatDate(item.EFFECTIVE_DATE, 'DD-MMM-YY')
                        : '',
                    USED_FOR: s.USED_FOR,
                    USED_AREA: s.USED_AREA,
                    KEEPING_POINT: s.KEEPING_POINT,
                    QTY: s.QTY,
                    CLASSNAME: item.UN_CLASS
                        ? item.CLASS.TYPE_NAME.replace('Class ', '')
                        : '',
                    ...sectionData.reduce(
                        (acc, cur) => ({ ...acc, ...cur }),
                        {},
                    ),
                };
            });
        });
        return {
            data: newData,
            sections,
        };
    }
}
