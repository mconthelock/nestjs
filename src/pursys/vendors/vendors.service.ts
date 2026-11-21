import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';

import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { SearchVendorDto } from './dto/search-vendor.dto';

import { Vendors } from 'src/common/Entities/pursys/table/VENDORS.entity';
import { PURVMM_FORM } from 'src/common/Entities/webform/table/PURVMM_FORM.entity';
import { PUREVA_FORM } from 'src/common/Entities/webform/table/PUREVA_FORM.entity';
import { PUR_FILE } from 'src/common/Entities/webform/table/PUR_FILE.entity';

@Injectable()
export class VendorsService {
    constructor(
        @InjectRepository(Vendors, 'mitsuConnection')
        private readonly vnd: Repository<Vendors>,
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

        // Multi-currency / related vendor codes sharing the same TAX ID
        let relatedVendors: Vendors[] = [vendor];
        if (vendor.VND_TAXNO) {
            const matches = await this.vnd.find({
                where: { VND_TAXNO: vendor.VND_TAXNO },
                order: { VND_CODE: 'ASC' },
            });
            if (matches.length) relatedVendors = matches;
        }

        const latestFormNo = latestVmm
            ? this.formatFormNo('VMM', latestVmm.CYEAR, latestVmm.NRUNNO, latestVmm.FORM?.formmst)
            : null;

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
            VENDOR_ADDRESS: latestVmm?.ADDRESSES || [],
            PURVMM_SCMUSR: (latestVmm?.SCMUSER || []).map((u) => ({
                ...u,
                FORM_NO: latestFormNo,
            })),
            VENDOR_ATTFILE: files.map((f) => ({
                ...f,
                SOURCE_FORM: latestFormNo,
            })),
            VENDOR_CODES: relatedVendors.map((rv) => ({
                CODE_NUM: rv.VND_CODE,
                CODE_CURRENCY: rv.VND_CURRENCY || '-',
                CODE_PAY: rv.VND_TERM || '-',
                CODE_STATUS: rv.VND_STATUS === 'INACTIVE' || rv.VND_STATUS === 'DELETED' ? 0 : 1,
            })),
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
}
