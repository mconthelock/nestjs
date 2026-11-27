import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { SearchVendorDto } from './dto/search-vendor.dto';
import {
    SearchVendorGroupDto,
    LinkVendorCodesDto,
    SetPrimaryVendorCodeDto,
    UnlinkVendorCodeDto,
} from './dto/vendor-group.dto';

import { Vendors } from 'src/common/Entities/pursys/table/VENDORS.entity';
import { VendorsCode } from 'src/common/Entities/pursys/table/VENDORS_CODE.entity';
import { VendorsAddress } from 'src/common/Entities/pursys/table/VENDORS_ADDRESS.entity';
import { PURVMM_FORM } from 'src/common/Entities/webform/table/PURVMM_FORM.entity';
import { PUREVA_FORM } from 'src/common/Entities/webform/table/PUREVA_FORM.entity';
import { PUR_FILE } from 'src/common/Entities/webform/table/PUR_FILE.entity';

@Injectable()
export class VendorsService {
    constructor(
        @InjectRepository(Vendors, 'mitsuConnection')
        private readonly vnd: Repository<Vendors>,
        @InjectRepository(VendorsCode, 'mitsuConnection')
        private readonly vndCodeRepo: Repository<VendorsCode>,
        @InjectRepository(VendorsAddress, 'mitsuConnection')
        private readonly vndAddrRepo: Repository<VendorsAddress>,
        @InjectRepository(PURVMM_FORM, 'mitsuConnection')
        private readonly purvmm: Repository<PURVMM_FORM>,
        @InjectRepository(PUREVA_FORM, 'mitsuConnection')
        private readonly pureva: Repository<PUREVA_FORM>,
        @InjectRepository(PUR_FILE, 'mitsuConnection')
        private readonly purFile: Repository<PUR_FILE>,
    ) {}

    async search(q?: SearchVendorDto) {
        const qb = this.vnd.createQueryBuilder('vnd');

        if (q.IS_DETAIL) {
            qb.leftJoinAndSelect('vnd.PURVMM', 'history')
                .leftJoinAndSelect('vnd.PUREVA', 'eva')
                .leftJoinAndSelect('vnd.STDCUR', 'currency')
                .leftJoinAndSelect('history.FORM', 'form')
                .leftJoinAndSelect('history.ADDRESSES', 'addr')
                .leftJoinAndSelect('eva.FORM', 'evaform')
                .leftJoinAndSelect('form.flow', 'flow');
            delete q.IS_DETAIL;
        }
        if (q) await applyDynamicFilters(qb, q, 'vnd');
        return qb.getMany();
    }

    async create(dto: CreateVendorDto) {
        const nextVendorCode = await this.nextVendor(dto.VENDGROUP, dto.VENDPURPOSE);
        dto = { ...dto, VND_CODE: nextVendorCode, CREATE_AT: new Date() };
        delete dto.VENDGROUP;
        delete dto.VENDPURPOSE;
        const vendor = this.vnd.create(dto);
        return this.vnd.save(vendor);
    }

    async update(vndCode: string, dto: UpdateVendorDto) {
        const vendor = await this.vnd.findOne({ where: { VND_CODE: vndCode } });
        if (!vendor) {
            throw new NotFoundException(`Vendor with code ${vndCode} not found`);
        }
        Object.assign(vendor, dto);
        return this.vnd.save(vendor);
    }

    async nextVendor(first: number, second?: number) {
        let minCode: number;
        let maxCode: number;
        if (first == 6) {
            minCode = parseInt(`${first}${second ? second : '0'}000`);
            maxCode = parseInt(`${first}${second ? second : '8'}999`);
        } else {
            minCode = parseInt(`${first}${first == 8 ? '0' : second}000`);
            maxCode = parseInt(`${first}${first == 8 ? '9' : second}999`);
        }
        const vendors = await this.vnd.find();
        const nextVendor = vendors
            .filter((v) => parseInt(v.VND_CODE) >= minCode && parseInt(v.VND_CODE) <= maxCode)
            .sort((a, b) => parseInt(a.VND_CODE) - parseInt(b.VND_CODE))
            .pop();
        const nextVendorCode = nextVendor
            ? (parseInt(nextVendor.VND_CODE) + 1).toString()
            : minCode.toString();
        return nextVendorCode;
    }

    // =========================================================================
    // Read-Only Vendor Detail & Monitoring Endpoints (Non-breaking additions)
    // =========================================================================

    private formatFormNo(
        prefix: string,
        cyear: string,
        nrunno: number,
        formmst?: { VANAME?: string },
    ): string {
        const code = formmst?.VANAME || prefix;
        const run = String(nrunno ?? 0).padStart(6, '0');
        return `${code}${cyear || ''}-${run}`;
    }

    private toVmmSnapshot(vmm: PURVMM_FORM) {
        const enAddr = (vmm.ADDRESSES || []).find((a) => a.ADDRTYPE === 'E');
        return {
            VENDNAME: vmm.VENDNAME || '',
            VENDGROUPTYPE: vmm.VENDGROUPTYPE || '',
            VENDCAT: vmm.VENDCAT || '',
            TAXID: vmm.TAXID || '',
            CANO: vmm.CANO || '',
            BANO: vmm.BANO || '',
            CURCODE: vmm.CURCODE || '',
            TERMCODE: vmm.TERMCODE || '',
            TRADE_CODE: vmm.TRADE_CODE || '',
            VTYPE: vmm.VTYPE || '',
            VPAYTO: vmm.VPAYTO || '',
            V1TIME: vmm.V1TIME || '',
            CONTACT: vmm.CONTACT || '',
            EMAIL: vmm.EMAIL || '',
            TELNO: vmm.TELNO || '',
            FAX: vmm.FAX || '',
            WEBSITE: vmm.WEBSITE || '',
            ADDR1: enAddr?.ADDR1 || '',
            ADDR2: enAddr?.ADDR2 || '',
            CITY: enAddr?.CITY || '',
            STATE: enAddr?.STATE || '',
            POSTCODE: enAddr?.POSTCODE || '',
            COUNTRY: enAddr?.COUNTRY || '',
            BANKNAME: vmm.BANKNAME || '',
            BRANCH: vmm.BRANCH || '',
            ACCNUMBER: vmm.ACCNUMBER || '',
        };
    }

    async getDetail(vndCode: string) {
        if (!vndCode) {
            throw new BadRequestException('VENDCODE is required');
        }

        const vendor = await this.vnd.findOne({
            where: { VND_CODE: vndCode },
        });
        if (!vendor) {
            throw new NotFoundException(`Vendor with code ${vndCode} not found`);
        }

        // Latest approved Cover Sheet Form (CST = '2'), fallback to latest any status
        let latestVmm: PURVMM_FORM | null = null;
        try {
            const vmmForms = await this.purvmm
                .createQueryBuilder('vmm')
                .leftJoinAndSelect('vmm.FORM', 'form')
                .leftJoinAndSelect('form.formmst', 'formmst')
                .leftJoinAndSelect('form.creator', 'creator')
                .leftJoinAndSelect('vmm.ADDRESSES', 'addr')
                .leftJoinAndSelect('vmm.SCMUSER', 'scm')
                .leftJoinAndSelect('vmm.TERM', 'term')
                .leftJoinAndSelect('vmm.CURRENCY', 'currency')
                .leftJoinAndSelect('vmm.TRADE', 'trade')
                .where('vmm.VENDCODE = :vndCode', { vndCode })
                .orderBy('vmm.CYEAR2', 'DESC')
                .addOrderBy('vmm.NRUNNO', 'DESC')
                .getMany();

            latestVmm =
                vmmForms.find((f) => String(f.FORM?.CST) === '2') || vmmForms[0] || null;
        } catch {
            latestVmm = null;
        }

        // Active attachments linked to latest VMM form
        let files: PUR_FILE[] = [];
        if (latestVmm) {
            try {
                files = await this.purFile.find({
                    where: {
                        NFRMNO: latestVmm.NFRMNO,
                        VORGNO: latestVmm.VORGNO,
                        CYEAR: latestVmm.CYEAR,
                        CYEAR2: latestVmm.CYEAR2,
                        NRUNNO: latestVmm.NRUNNO,
                        FILE_STATUS: 1,
                    },
                    order: { FILE_ID: 'ASC' },
                });
            } catch {
                files = [];
            }
        }

        // Resolve Vendor Group from PURSYS.VENDORS_CODE (using VENDOR_ID as Group ID)
        let groupInfo: {
            GROUP_ID: string;
            VENDOR_ID: number;
            GROUP_NAME: string;
            REMARK?: string;
            MEMBERS: Array<{
                VND_CODE: string;
                VND_NAME: string;
                VND_CURRENCY: string;
                VND_TERM: string;
                VND_STATUS: string;
                IS_PRIMARY: string;
            }>;
        } | null = null;
        let relatedVendors: Vendors[] = [vendor];
        let pursysAddresses: VendorsAddress[] = [];

        try {
            const codeNum = Number(vndCode);
            const membership = !Number.isNaN(codeNum)
                ? await this.vndCodeRepo.findOne({ where: { CODE_NUM: codeNum } })
                : null;

            if (membership?.VENDOR_ID) {
                const groupRows = await this.vndCodeRepo.find({
                    where: { VENDOR_ID: membership.VENDOR_ID },
                    order: { CODE_SHIP: 'DESC', CODE_NUM: 'ASC' },
                });
                const memberCodes = groupRows.map((r) => String(r.CODE_NUM));
                const memberVendors = memberCodes.length
                    ? await this.vnd.find({ where: { VND_CODE: In(memberCodes) } })
                    : [];
                const vendorMap = new Map(memberVendors.map((v) => [String(v.VND_CODE), v]));

                const members = groupRows.map((row) => {
                    const codeStr = String(row.CODE_NUM);
                    const mv = vendorMap.get(codeStr);
                    return {
                        VND_CODE: codeStr,
                        VND_NAME: mv?.VND_NAME || '',
                        VND_CURRENCY: mv?.VND_CURRENCY || row.CODE_CURRENCY || '-',
                        VND_TERM: mv?.VND_TERM || row.CODE_PAY || '-',
                        VND_STATUS: mv?.VND_STATUS || (Number(row.CODE_STATUS) === 1 ? 'ACTIVE' : 'INACTIVE'),
                        IS_PRIMARY: Number(row.CODE_SHIP) === 1 ? 'Y' : 'N',
                    };
                });

                const primaryMember = members.find((m) => m.IS_PRIMARY === 'Y') || members[0];
                groupInfo = {
                    GROUP_ID: this.formatGroupId(membership.VENDOR_ID),
                    VENDOR_ID: Number(membership.VENDOR_ID),
                    GROUP_NAME: primaryMember?.VND_NAME || vendor.VND_NAME,
                    MEMBERS: members,
                };
                if (memberVendors.length) relatedVendors = memberVendors;

                pursysAddresses = await this.vndAddrRepo.find({
                    where: { VENDOR_ID: membership.VENDOR_ID },
                    order: { ADDR_TYPE: 'ASC', ADDR_ID: 'ASC' },
                });
            }
        } catch {
            groupInfo = null;
        }

        if (!groupInfo && vendor.VND_TAXNO) {
            const matches = await this.vnd.find({
                where: { VND_TAXNO: vendor.VND_TAXNO },
                order: { VND_CODE: 'ASC' },
            });
            if (matches.length) relatedVendors = matches;
        }

        const latestFormNo = latestVmm
            ? this.formatFormNo('VMM', latestVmm.CYEAR, latestVmm.NRUNNO, latestVmm.FORM?.formmst)
            : null;

        // Shared E-SCM users across all sibling VND_CODEs in the group
        let sharedScmUsers = (latestVmm?.SCMUSER || []).map((u) => ({
            ...u,
            FORM_NO: latestFormNo,
            SOURCE_VND_CODE: vndCode,
        }));

        if (groupInfo && groupInfo.MEMBERS.length > 1) {
            try {
                const siblingCodes = groupInfo.MEMBERS.map((m) => m.VND_CODE);
                const siblingVmms = await this.purvmm
                    .createQueryBuilder('vmm')
                    .leftJoinAndSelect('vmm.FORM', 'form')
                    .leftJoinAndSelect('form.formmst', 'formmst')
                    .leftJoinAndSelect('vmm.SCMUSER', 'scm')
                    .where('vmm.VENDCODE IN (:...codes)', { codes: siblingCodes })
                    .orderBy('vmm.CYEAR2', 'DESC')
                    .addOrderBy('vmm.NRUNNO', 'DESC')
                    .getMany();

                const seenUsernames = new Set<string>();
                const merged: any[] = [];
                for (const sv of siblingVmms) {
                    const fNo = this.formatFormNo('VMM', sv.CYEAR, sv.NRUNNO, sv.FORM?.formmst);
                    for (const u of sv.SCMUSER || []) {
                        const key = (u.USERNAME || u.EMAIL || `${u.ID}`).toLowerCase();
                        if (!seenUsernames.has(key)) {
                            seenUsernames.add(key);
                            merged.push({
                                ...u,
                                FORM_NO: fNo,
                                SOURCE_VND_CODE: sv.VENDCODE,
                            });
                        }
                    }
                }
                if (merged.length) sharedScmUsers = merged;
            } catch {
                // Keep latestVmm SCM users on fallback
            }
        }

        return {
            ...vendor,
            VND_REGNAME: latestVmm?.FORM?.creator?.SNAME || vendor.CREATE_BY || null,
            VND_LASTUPDATE: vendor.UPDATE_AT || vendor.CREATE_AT || vendor.VND_REGISTED,
            VENDGROUPTYPE: latestVmm?.VENDGROUPTYPE || vendor.VND_TYPE1 || null,
            VENDCAT: latestVmm?.VENDCAT || vendor.VND_CATEGORY || null,
            TAXID: latestVmm?.TAXID || vendor.VND_TAXNO || null,
            CANO: latestVmm?.CANO || vendor.VND_CANO || null,
            BANO: latestVmm?.BANO || vendor.VND_BANO || null,
            CURCODE: latestVmm?.CURCODE || vendor.VND_CURRENCY || null,
            TERMCODE: latestVmm?.TERMCODE
                ? latestVmm.TERM?.STERMDESC
                    ? `${latestVmm.TERMCODE} — ${latestVmm.TERM.STERMDESC}`
                    : latestVmm.TERMCODE
                : vendor.VND_TERM || null,
            TRADE_CODE: latestVmm?.TRADE_CODE
                ? latestVmm.TRADE?.TRADE_NAME
                    ? `${latestVmm.TRADE_CODE} — ${latestVmm.TRADE.TRADE_NAME}`
                    : latestVmm.TRADE_CODE
                : null,
            VTYPE: latestVmm?.VTYPE || vendor.VND_TYPE2 || null,
            VPAYTO: latestVmm?.VPAYTO || null,
            V1TIME: latestVmm?.V1TIME || 'N',
            VNALPH: latestVmm?.VNALPH || null,
            EMAIL: latestVmm?.EMAIL || null,
            WEBSITE: latestVmm?.WEBSITE || null,
            BANKNAME: latestVmm?.BANKNAME || null,
            BRANCH: latestVmm?.BRANCH || null,
            BANKADDR: latestVmm?.BANKADDR || null,
            ACCNUMBER: latestVmm?.ACCNUMBER || null,
            EVANO: latestVmm?.EVANO || null,
            VENDOR_GROUP: groupInfo,
            VENDOR_ADDRESS:
                latestVmm?.ADDRESSES?.length
                    ? latestVmm.ADDRESSES
                    : pursysAddresses.map((a) => ({
                          ADDR_TYPE: a.ADDR_TYPE,
                          ADDR_LINE1: a.ADDR_LINE1,
                          ADDR_LINE2: a.ADDR_LINE2 || a.ADDR_SUB_CITY || '',
                          ADDR_LINE3: a.ADDR_LINE3 || '',
                          ADDR_CITY: a.ADDR_CITY || '',
                          ADDR_STATE: a.ADDR_STATE || '',
                          ADDR_COUNTRY: a.ADDR_COUNTRY || '',
                          ADDR_ZIPCODE: a.ADDR_ZIPCODE || '',
                      })),
            PURVMM_SCMUSR: sharedScmUsers,
            VENDOR_ATTFILE: files.map((f) => ({
                ...f,
                SOURCE_FORM: latestFormNo,
            })),
            VENDOR_CODES: relatedVendors.map((rv) => {
                const gm = groupInfo?.MEMBERS.find((m) => m.VND_CODE === rv.VND_CODE);
                return {
                    CODE_NUM: rv.VND_CODE,
                    CODE_CURRENCY: rv.VND_CURRENCY || '-',
                    CODE_PAY: rv.VND_TERM || '-',
                    CODE_STATUS: rv.VND_STATUS === 'INACTIVE' || rv.VND_STATUS === 'DELETED' ? 0 : 1,
                    IS_PRIMARY: gm?.IS_PRIMARY || 'N',
                };
            }),
        };
    }

    async getHistory(vndCode: string) {
        if (!vndCode) {
            throw new BadRequestException('VENDCODE is required');
        }

        let forms: PURVMM_FORM[] = [];
        try {
            forms = await this.purvmm
                .createQueryBuilder('vmm')
                .leftJoinAndSelect('vmm.FORM', 'form')
                .leftJoinAndSelect('form.formmst', 'formmst')
                .leftJoinAndSelect('form.flow', 'flow')
                .leftJoinAndSelect('flow.steps', 'steps')
                .leftJoinAndSelect('vmm.ADDRESSES', 'addr')
                .where('vmm.VENDCODE = :vndCode', { vndCode })
                .orderBy('vmm.CYEAR2', 'ASC')
                .addOrderBy('vmm.NRUNNO', 'ASC')
                .getMany();
        } catch {
            return [];
        }

        // Build chronological snapshots so each revision compares against the previous approved revision
        let lastApprovedSnapshot: Record<string, string> = {};
        const chronological = forms.map((vmm, idx) => {
            const currSnapshot = this.toVmmSnapshot(vmm);
            const prevSnapshot = { ...lastApprovedSnapshot };
            const statusNum = Number(vmm.FORM?.CST ?? 2);

            if (statusNum === 2) {
                lastApprovedSnapshot = currSnapshot;
            }

            const flowList = (vmm.FORM?.flow || []).slice().sort((a, b) =>
                String(a.CSTEPNO || '').localeCompare(String(b.CSTEPNO || '')),
            );

            const pendingFlow = flowList.find((fl) => String(fl.CSTEPST) === '3');
            const approvals = flowList
                .filter((fl) => fl.DAPVDATE || fl.VREALAPV || String(fl.CSTEPST) === '5')
                .map((fl) => {
                    const stepObj = Array.isArray(fl.steps) ? fl.steps[0] : (fl.steps as any);
                    return {
                        role: stepObj?.VNAME || stepObj?.VDESC || `Step ${fl.CSTEPNO}`,
                        user: fl.VREALAPV || fl.VAPVNO || '-',
                        action:
                            String(fl.CAPVSTNO) === '2'
                                ? 'Rejected'
                                : String(fl.CSTEPST) === '5'
                                    ? 'Approved'
                                    : 'Processed',
                        timestamp: fl.DAPVDATE || vmm.FORM?.DREQDATE || null,
                    };
                });

            const pendingStepObj = pendingFlow
                ? Array.isArray(pendingFlow.steps)
                    ? pendingFlow.steps[0]
                    : (pendingFlow.steps as any)
                : null;

            return {
                revNo: idx + 1,
                formNo: this.formatFormNo('VMM', vmm.CYEAR, vmm.NRUNNO, vmm.FORM?.formmst),
                evaNo: vmm.EVANO || '',
                mode: vmm.REQTYPE || 'U',
                status: statusNum,
                approvedDate: vmm.FORM?.DREQDATE || null,
                pendingStep: pendingStepObj?.VNAME || pendingStepObj?.VDESC || null,
                approvals,
                prevSnapshot,
                currSnapshot,
            };
        });

        // Return newest first for UI display
        return chronological.reverse();
    }

    async getEvaluation(vndCode: string) {
        if (!vndCode) {
            throw new BadRequestException('VENDCODE is required');
        }

        let eva: PUREVA_FORM | null = null;
        try {
            eva = await this.pureva
                .createQueryBuilder('eva')
                .leftJoinAndSelect('eva.FORM', 'form')
                .leftJoinAndSelect('form.formmst', 'formmst')
                .leftJoinAndSelect('eva.SCORES', 'scores')
                .leftJoinAndSelect('eva.PROFIT_TURNOVERS', 'financials')
                .leftJoinAndSelect('eva.RELATIONS', 'relations')
                .leftJoinAndSelect('eva.TERM', 'term')
                .leftJoinAndSelect('eva.STDCUR', 'stdcur')
                .leftJoinAndSelect('eva.CAPCUR', 'capcur')
                .where('eva.VENDCODE = :vndCode', { vndCode })
                .orderBy('eva.CYEAR2', 'DESC')
                .addOrderBy('eva.NRUNNO', 'DESC')
                .getOne();
        } catch {
            return null;
        }

        if (!eva) {
            return null;
        }

        return {
            ...eva,
            EVANO: this.formatFormNo('EVA', eva.CYEAR, eva.NRUNNO, eva.FORM?.formmst),
            SCORES: eva.SCORES || [],
            FINANCIALS: eva.PROFIT_TURNOVERS || [],
            RELATIONS: eva.RELATIONS || [],
        };
    }

    // =========================================================================
    // Multi-Code Vendor Grouping Services (PURSYS.VENDORS_CODE)
    // Uses VENDOR_ID as Group Key, CODE_NUM as 5-digit VND_CODE, CODE_SHIP=1 as Primary
    // =========================================================================

    private formatGroupId(vendorId: number | string): string {
        return `VGRP-${String(Number(vendorId) || 0).padStart(5, '0')}`;
    }

    private parseGroupId(groupId?: string): number | null {
        if (!groupId) return null;
        const match = String(groupId).match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : null;
    }

    private async generateNextVendorGroupId(): Promise<number> {
        const res = await this.vndCodeRepo
            .createQueryBuilder('vc')
            .select('MAX(vc.VENDOR_ID)', 'maxId')
            .getRawOne();
        const currentMax = Number(res?.maxId || 1000);
        return currentMax < 1000 ? 1001 : currentMax + 1;
    }

    async searchGroups(dto?: SearchVendorGroupDto) {
        let rows: VendorsCode[] = [];
        try {
            const qb = this.vndCodeRepo
                .createQueryBuilder('vc')
                .orderBy('vc.VENDOR_ID', 'ASC')
                .addOrderBy('vc.CODE_SHIP', 'DESC')
                .addOrderBy('vc.CODE_NUM', 'ASC');

            const gid = this.parseGroupId(dto?.GROUP_ID);
            if (gid !== null) {
                qb.andWhere('vc.VENDOR_ID = :gid', { gid });
            }
            rows = await qb.getMany();
        } catch {
            return [];
        }

        const allCodes = [...new Set(rows.map((r) => String(r.CODE_NUM)))];
        const vendorRows = allCodes.length
            ? await this.vnd.find({ where: { VND_CODE: In(allCodes) } })
            : [];
        const vendorMap = new Map(vendorRows.map((v) => [String(v.VND_CODE), v]));

        const grouped = new Map<number, any>();
        for (const row of rows) {
            const vid = Number(row.VENDOR_ID || 0);
            if (!vid) continue;
            const codeStr = String(row.CODE_NUM);
            const mv = vendorMap.get(codeStr);
            if (!grouped.has(vid)) {
                grouped.set(vid, {
                    GROUP_ID: this.formatGroupId(vid),
                    VENDOR_ID: vid,
                    GROUP_NAME: mv?.VND_NAME || `Vendor Group ${vid}`,
                    STATUS: 'ACTIVE',
                    MEMBERS: [],
                });
            }
            const g = grouped.get(vid);
            if (Number(row.CODE_SHIP) === 1 && mv?.VND_NAME) {
                g.GROUP_NAME = mv.VND_NAME;
            }
            g.MEMBERS.push({
                ID: Number(row.CODE_ID),
                VND_CODE: codeStr,
                IS_PRIMARY: Number(row.CODE_SHIP) === 1 ? 'Y' : 'N',
                VND_NAME: mv?.VND_NAME || '',
                VND_CURRENCY: mv?.VND_CURRENCY || row.CODE_CURRENCY || '-',
                VND_TERM: mv?.VND_TERM || row.CODE_PAY || '-',
                VND_STATUS: mv?.VND_STATUS || (Number(row.CODE_STATUS) === 1 ? 'ACTIVE' : 'INACTIVE'),
                VND_TAXNO: mv?.VND_TAXNO || '',
            });
        }

        let list = Array.from(grouped.values());
        if (dto?.keyword) {
            const q = dto.keyword.toLowerCase().trim();
            list = list.filter(
                (g) =>
                    g.GROUP_ID.toLowerCase().includes(q) ||
                    g.GROUP_NAME.toLowerCase().includes(q) ||
                    g.MEMBERS.some(
                        (m) =>
                            m.VND_CODE.toLowerCase().includes(q) ||
                            m.VND_NAME.toLowerCase().includes(q),
                    ),
            );
        }
        return list;
    }

    async getGroupSuggestions(vndCode: string) {
        if (!vndCode) {
            throw new BadRequestException('VENDCODE is required');
        }
        const target = await this.vnd.findOne({ where: { VND_CODE: vndCode } });
        if (!target) return [];

        const codeToGroupMap = new Map<string, number>();
        let myGroupId: number | null = null;
        try {
            const existing = await this.vndCodeRepo.find({ select: ['CODE_NUM', 'VENDOR_ID'] });
            for (const e of existing) {
                const c = String(e.CODE_NUM);
                const gid = Number(e.VENDOR_ID || 0);
                if (gid) codeToGroupMap.set(c, gid);
                if (c === String(vndCode) && gid) myGroupId = gid;
            }
        } catch {
            // ignore if table unavailable
        }

        const all = await this.vnd.find({ order: { VND_CODE: 'ASC' } });
        const targetTax = (target.VND_TAXNO || '').trim();
        const targetPrefix = (target.VND_NAME || '').trim().toLowerCase().slice(0, 12);

        return all
            .filter((v) => {
                if (v.VND_CODE === vndCode) return false;
                const otherGid = codeToGroupMap.get(v.VND_CODE) || null;
                // Exclude only codes already in the SAME group
                if (myGroupId && otherGid === myGroupId) return false;

                const sameTax = targetTax && (v.VND_TAXNO || '').trim() === targetTax;
                const similarName =
                    targetPrefix.length >= 6 &&
                    (v.VND_NAME || '').trim().toLowerCase().startsWith(targetPrefix);
                return Boolean(sameTax || similarName);
            })
            .slice(0, 10)
            .map((v) => {
                const otherGid = codeToGroupMap.get(v.VND_CODE) || null;
                return {
                    VND_CODE: v.VND_CODE,
                    VND_NAME: v.VND_NAME,
                    VND_CURRENCY: v.VND_CURRENCY || '-',
                    VND_TERM: v.VND_TERM || '-',
                    VND_TAXNO: v.VND_TAXNO || '',
                    EXISTING_GROUP_ID: otherGid ? this.formatGroupId(otherGid) : null,
                    MATCH_REASON:
                        targetTax && (v.VND_TAXNO || '').trim() === targetTax
                            ? 'Same Tax ID'
                            : 'Similar Name',
                };
            });
    }

    async getGroupByCode(vndCode: string) {
        if (!vndCode) {
            throw new BadRequestException('VENDCODE is required');
        }

        const vendor = await this.vnd.findOne({ where: { VND_CODE: vndCode } });
        if (!vendor) {
            throw new NotFoundException(`Vendor with code ${vndCode} not found`);
        }

        let group: any = null;
        try {
            const codeNum = Number(vndCode);
            const row = !Number.isNaN(codeNum)
                ? await this.vndCodeRepo.findOne({ where: { CODE_NUM: codeNum } })
                : null;
            if (row?.VENDOR_ID) {
                const groups = await this.searchGroups({
                    GROUP_ID: this.formatGroupId(row.VENDOR_ID),
                });
                group = groups[0] || null;
            }
        } catch {
            group = null;
        }

        const suggestions = await this.getGroupSuggestions(vndCode);
        return {
            VND_CODE: vndCode,
            VND_NAME: vendor.VND_NAME,
            GROUP: group,
            SUGGESTIONS: suggestions,
        };
    }

    async linkCodesToGroup(dto: LinkVendorCodesDto) {
        const codes = [...new Set((dto.VND_CODES || []).map((c) => c.trim()).filter(Boolean))];
        if (!codes.length) {
            throw new BadRequestException('At least one VND_CODE is required');
        }

        const foundVendors = await this.vnd.find({ where: { VND_CODE: In(codes) } });
        if (foundVendors.length !== codes.length) {
            const foundSet = new Set(foundVendors.map((v) => v.VND_CODE));
            const missing = codes.filter((c) => !foundSet.has(c));
            throw new NotFoundException(`Vendor code(s) not found: ${missing.join(', ')}`);
        }
        const vendorMap = new Map(foundVendors.map((v) => [v.VND_CODE, v]));

        const codeNums = codes.map((c) => Number(c)).filter((n) => !Number.isNaN(n));
        const existingRows = codeNums.length
            ? await this.vndCodeRepo.find({ where: { CODE_NUM: In(codeNums) } })
            : [];

        // Bidirectional resolution:
        // 1) Use explicit dto.GROUP_ID if provided
        // 2) Otherwise adopt the existing VENDOR_ID of any involved code (so standalone -> grouped works!)
        // 3) Otherwise generate a brand new VENDOR_ID
        const existingGroupIds = [
            ...new Set(existingRows.map((r) => Number(r.VENDOR_ID)).filter((id) => id > 0)),
        ];
        const vendorGroupId =
            this.parseGroupId(dto.GROUP_ID) ??
            existingGroupIds[0] ??
            (await this.generateNextVendorGroupId());

        // Merge any other existing groups involved into vendorGroupId
        const otherGroupIds = existingGroupIds.filter((gid) => gid !== vendorGroupId);
        if (otherGroupIds.length) {
            const rowsToMerge = await this.vndCodeRepo.find({
                where: { VENDOR_ID: In(otherGroupIds) },
            });
            for (const row of rowsToMerge) {
                row.VENDOR_ID = vendorGroupId;
                row.CODE_SHIP = 0; // Keep target group's primary
            }
            if (rowsToMerge.length) {
                await this.vndCodeRepo.save(rowsToMerge);
            }
            // Also move addresses from merged groups so none are orphaned
            try {
                await this.vndAddrRepo
                    .createQueryBuilder()
                    .update(VendorsAddress)
                    .set({ VENDOR_ID: vendorGroupId })
                    .where('VENDOR_ID IN (:...oldIds)', { oldIds: otherGroupIds })
                    .execute();
            } catch {
                // ignore if address update unavailable
            }
        }

        const currentGroupRows = await this.vndCodeRepo.find({
            where: { VENDOR_ID: vendorGroupId },
        });
        const alreadyInGroup = new Set(currentGroupRows.map((r) => String(r.CODE_NUM)));
        const hasPrimary = currentGroupRows.some((r) => Number(r.CODE_SHIP) === 1);

        const toInsert = codes
            .filter((code) => !alreadyInGroup.has(code))
            .map((code, idx) => {
                const mv = vendorMap.get(code);
                const isPrimary =
                    dto.PRIMARY_CODE === code || (!hasPrimary && !dto.PRIMARY_CODE && idx === 0);
                return this.vndCodeRepo.create({
                    CODE_NUM: Number(code),
                    VENDOR_ID: vendorGroupId,
                    CODE_STATUS: mv?.VND_STATUS === 'INACTIVE' ? 0 : 1,
                    CODE_REGDATE: mv?.VND_REGISTED || new Date(),
                    CODE_CURRENCY: (mv?.VND_CURRENCY || 'THB').slice(0, 3),
                    CODE_SHIP: isPrimary ? 1 : 0,
                    CODE_PAY: (mv?.VND_TERM || '').slice(0, 8),
                    CODE_TYPE: Number(code.charAt(0)) || 5,
                });
            });

        if (toInsert.length) {
            await this.vndCodeRepo.save(toInsert);
        }

        if (dto.PRIMARY_CODE && !hasPrimary) {
            await this.setPrimaryCode({
                GROUP_ID: this.formatGroupId(vendorGroupId),
                VND_CODE: dto.PRIMARY_CODE,
                USER_BY: dto.USER_BY,
            });
        }

        const updated = await this.searchGroups({
            GROUP_ID: this.formatGroupId(vendorGroupId),
        });
        return updated[0] || null;
    }

    async setPrimaryCode(dto: SetPrimaryVendorCodeDto) {
        const gid = this.parseGroupId(dto.GROUP_ID);
        if (gid === null) {
            throw new BadRequestException('Invalid GROUP_ID');
        }
        const rows = await this.vndCodeRepo.find({ where: { VENDOR_ID: gid } });
        if (!rows.length) {
            throw new NotFoundException(`Group ${dto.GROUP_ID} not found`);
        }
        const target = rows.find((r) => String(r.CODE_NUM) === String(dto.VND_CODE));
        if (!target) {
            throw new NotFoundException(`Code ${dto.VND_CODE} is not in group ${dto.GROUP_ID}`);
        }

        for (const r of rows) {
            r.CODE_SHIP = String(r.CODE_NUM) === String(dto.VND_CODE) ? 1 : 0;
        }
        await this.vndCodeRepo.save(rows);

        const updated = await this.searchGroups({ GROUP_ID: this.formatGroupId(gid) });
        return updated[0] || null;
    }

    async unlinkCodeFromGroup(dto: UnlinkVendorCodeDto) {
        const gid = this.parseGroupId(dto.GROUP_ID);
        if (gid === null) {
            throw new BadRequestException('Invalid GROUP_ID');
        }
        const rows = await this.vndCodeRepo.find({
            where: { VENDOR_ID: gid },
            order: { CODE_NUM: 'ASC' },
        });
        const target = rows.find((r) => String(r.CODE_NUM) === String(dto.VND_CODE));
        if (!target) {
            throw new NotFoundException(`Code ${dto.VND_CODE} is not in group ${dto.GROUP_ID}`);
        }

        const wasPrimary = Number(target.CODE_SHIP) === 1;
        await this.vndCodeRepo.remove(target);

        const remaining = rows.filter((r) => String(r.CODE_NUM) !== String(dto.VND_CODE));
        if (remaining.length && wasPrimary) {
            remaining[0].CODE_SHIP = 1;
            await this.vndCodeRepo.save(remaining[0]);
        }

        const updated = await this.searchGroups({ GROUP_ID: this.formatGroupId(gid) });
        return updated[0] || null;
    }
}
