import { Injectable } from '@nestjs/common';
import { FiltersDto } from 'src/common/dto/filter.dto';
import { OrganizationsRepository } from './organizations.repository';

@Injectable()
export class OrganizationsService {
    constructor(private readonly repo: OrganizationsRepository) {}
    async findAll() {
        try {
            const res = await this.repo.findAll();
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search ORGANIZATIONS Failed: No data found',
                    data: [],
                };
            }
            for (const d of res) {
            }
            return {
                status: true,
                message: `Search ORGANIZATIONS data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search ORGANIZATIONS Error: ' + error.message);
        }
    }

    async search(dto: FiltersDto) {
        try {
            const res = await this.repo.search(dto);
            const length = res.length;
            if (length === 0) {
                return {
                    status: false,
                    message: 'Search ORGANIZATIONS Failed: No data found',
                    data: [],
                };
            }
            return {
                status: true,
                message: `Search ORGANIZATIONS data found ${length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error('Search ORGANIZATIONS Error: ' + error.message);
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-29
     * @description ตรวจสอบว่าหน่วยงานที่ระบุมีอยู่ในระบบหรือไม่ และยังใช้งานอยู่หรือไม่
     * @param org
     * @returns
     */
    async checkOrganization(org: string): Promise<boolean> {
        try {
            const orgs = await this.findAll();
            const findOrg = orgs.data.find(
                (o) =>
                    o.SDIVCODE === org ||
                    o.SDEPCODE === org ||
                    o.SSECCODE === org,
            );
            if (!findOrg) {
                throw new Error('No organizations found');
            }
            return findOrg.CSTATUS === '1';
        } catch (error) {
            throw error;
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-10-29
     * @param org รหัสหน่วยงานที่ต้องการค้นหาหน่วยงานย่อย
     * @param parent กำหนดว่าให้รวมหน่วยงานต้นทางด้วยหรือไม่
     * @returns รายการหน่วยงานย่อยที่ตรงตามเงื่อนไข
     */
    async getSubOrganizations(org: string, parent: boolean = false) {
        try {
            const orgs = await this.findAll();
            return orgs.data
                .filter(
                    (o) =>
                        (o.SDIVCODE === org ||
                            o.SDEPCODE === org ||
                            o.SSECCODE === org) &&
                        o.CSTATUS === '1',
                )
                .map((o) => {
                    if (o.SDEPCODE === '00' && o.SSECCODE === '00') {
                        return {
                            CODE: o.SDIVCODE,
                            NAME: o.SDIV,
                            TYPE: 'DIVISION',
                        };
                    }
                    if (o.SSECCODE === '00') {
                        return {
                            CODE: o.SDEPCODE,
                            NAME: o.SDEPT,
                            TYPE: 'DEPARTMENT',
                        };
                    }
                    return {
                        CODE: o.SSECCODE,
                        NAME: o.SSEC,
                        TYPE: 'SECTION',
                    };
                })
                .filter(o => parent ? true : o.CODE !== org);
        } catch (error) {
            throw error;
        }
    }
}
