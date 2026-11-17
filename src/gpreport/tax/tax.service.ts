import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { applyDynamicFilters } from 'src/common/helpers/query.helper';
import { FormCreateService } from 'src/webform/form/create-form.service';

import { GPLY01_TAX } from 'src/common/Entities/webform/table/GPLY01_TAX.entiry';

import { CreateTaxDto } from './dto/create-tax.dto';
import { SearchTaxDto } from './dto/search-tax.dto';
import { TAX_MASTER_ITEMS, TaxItemConfig } from './constants/tax-items.constant';
import { TaxRepository } from './tax.repository';

@Injectable()
export class TaxService {
    constructor(
        @InjectRepository(GPLY01_TAX, 'mitsuConnection')
        private readonly taxRepo: Repository<GPLY01_TAX>,
        private readonly repo: TaxRepository,
        protected readonly formcreateservice: FormCreateService,
    ) {}

    getTaxItems(): TaxItemConfig[] {
        return TAX_MASTER_ITEMS;
    }

    async findCurrentTax(empno: string) {
        const cleanEmpno = (empno || '').trim();
        const data = await this.repo.findEmp03(cleanEmpno);
        return {
            ...data,
            TAX1: 60000,
            TAX2: data.FAMSNA.trim() != null && data.FAMSNA.trim() !== '' ? 60000 : 0,
            TAX3:
                data.C1IED * 30000 + data.C1NED * 30000 + (data.C2IED * 60000 + data.C2NED * 60000),
            TAX4:
                (data.TAXEMF.replaceAll(' ', '') !== '' ? 30000 : 0) +
                (data.TAXEMM.replaceAll(' ', '') !== '' ? 30000 : 0) +
                (data.TAXSFT.replaceAll(' ', '') !== '' ? 30000 : 0) +
                (data.TAXSPM.replaceAll(' ', '') !== '' ? 30000 : 0),
            FAMMRD: data.FAMMRD == 0 ? '' : data.FAMMRD,
        };
    }

    async findHistory(q: SearchTaxDto) {
        const qb = this.taxRepo
            .createQueryBuilder('req')
            .leftJoinAndSelect('req.form', 'form')
            .leftJoinAndSelect('form.formmst', 'formmst')
            .leftJoinAndSelect('form.flow', 'flow')
            .leftJoinAndSelect('flow.steps', 'steps');
        await applyDynamicFilters(qb, q, 'req');
        const data = await qb.getMany();
        const result = data.map((res) => {
            return {
                ...res,
                TAX1: 60000,
                TAX2: res.FAMSNA?.trim() ? 60000 : 0,
                TAX3:
                    res.C1IED * 30000 + res.C1NED * 30000 + (res.C2IED * 60000 + res.C2NED * 60000),
                TAX4:
                    (res.TAXEMF?.replaceAll(' ', '') ? 30000 : 0) +
                    (res.TAXEMM?.replaceAll(' ', '') ? 30000 : 0) +
                    (res.TAXSFT?.replaceAll(' ', '') ? 30000 : 0) +
                    (res.TAXSPM?.replaceAll(' ', '') ? 30000 : 0),
            };
        });
        return result;
    }

    async create(dto: CreateTaxDto, ip?: string) {
        try {
            const { REQBY, INPUTBY, DRAFT, REMARK, ...data } = dto;
            const createForm = await this.formcreateservice.create(
                {
                    NFRMNO: dto.NFRMNO,
                    VORGNO: dto.VORGNO,
                    CYEAR: dto.CYEAR,
                    REQBY: REQBY,
                    INPUTBY: INPUTBY,
                    REMARK: REMARK,
                    ...(DRAFT !== undefined && { DRAFT: DRAFT }),
                },
                ip,
            );
            if (!createForm.status) {
                throw new Error(createForm.message.message);
            }
            const form = {
                NFRMNO: dto.NFRMNO,
                VORGNO: dto.VORGNO,
                CYEAR: dto.CYEAR,
                CYEAR2: createForm.data.CYEAR2,
                NRUNNO: createForm.data.NRUNNO,
            };
            return await this.repo.create({
                ...data,
                ...form,
            });
        } catch (error) {
            throw new Error('Request GPLY01 Form Error: ' + error.message);
        }
    }

    /**
     * ดึงรายละเอียดคำขอรายใบงาน (Form + Tax + AS400 Snapshot + Flow)
     */
    // async findRequestDetail(year: string, runno: number, empno?: string) {
    //     const formWhere: any = {
    //         NFRMNO: this.NFRMNO,
    //         VORGNO: this.VORGNO,
    //         CYEAR: this.CYEAR,
    //         CYEAR2: year,
    //         NRUNNO: runno,
    //     };

    //     const form = await this.formRepo.findOne({ where: formWhere });
    //     if (!form) {
    //         throw new NotFoundException(
    //             `Tax form not found for year ${year} and runno ${runno}`,
    //         );
    //     }

    //     const tax = await this.taxRepo.findOne({ where: formWhere });
    //     const taxAs400 = await this.taxAs400Repo.findOne({ where: formWhere });
    //     const flows = await this.flowRepo.find({
    //         where: formWhere,
    //         order: { CSTEPNO: 'ASC' },
    //     });

    //     const formatted = tax ? this.formatTax(tax, 2, form.DREQDATE) : null;

    //     return {
    //         form,
    //         tax,
    //         taxAs400,
    //         flows,
    //         formatted,
    //     };
    // }

    /**

    /* สร้างหรืออัปเดตแบบคำขอลดหย่อนภาษี (Draft / Submit)
     */
    // async saveTaxRequest(dto: CreateTaxDto, clientIp?: string) {
    //     const currentYear = dto.year || new Date().getFullYear().toString();
    //     const empno = dto.empno;

    //     // 1. ตรวจสอบว่ามี RunNo ส่งมา หรือมี Form ค้าง (CST IN ('0', '1')) อยู่แล้วหรือไม่
    //     let targetRunno = dto.runno || 0;

    //     if (!targetRunno) {
    //         const existingPending = await this.formRepo.findOne({
    //             where: {
    //                 NFRMNO: this.NFRMNO,
    //                 VORGNO: this.VORGNO,
    //                 CYEAR: this.CYEAR,
    //                 CYEAR2: currentYear,
    //                 VREQNO: empno,
    //                 CST: In(['0', '1']),
    //             },
    //             order: { NRUNNO: 'DESC' },
    //         });

    //         if (existingPending) {
    //             targetRunno = existingPending.NRUNNO;
    //         }
    //     }

    //     const today = new Date();
    //     const dateStr = today.toISOString().split('T')[0];
    //     const timeStr = today.toTimeString().substring(0, 5); // HH:mm
    //     const timeSecStr = today.toTimeString().substring(0, 8); // HH:mm:ss

    //     // ดึง Snapshot ข้อมูลปัจจุบันจาก EMP03T เพื่อใช้บันทึกใน TAXAS400
    //     const emp03t = await this.emp03tRepo.findOne({
    //         where: { EMPCOD: empno },
    //     });

    //     if (targetRunno > 0) {
    //         // === อัปเดตคำขอเดิม ===
    //         const filter = {
    //             NFRMNO: this.NFRMNO,
    //             VORGNO: this.VORGNO,
    //             CYEAR: this.CYEAR,
    //             CYEAR2: currentYear,
    //             NRUNNO: targetRunno,
    //         };

    //         // อัปเดต GPLY01_TAX
    //         const mappedTax = this.mapTaxDtoToEntity(
    //             dto,
    //             targetRunno,
    //             currentYear,
    //         );
    //         await this.taxRepo.update(filter, mappedTax);

    //         // อัปเดต GPLY01_TAXAS400
    //         if (emp03t) {
    //             const mappedAs400 = this.mapEmp03tToAs400(
    //                 emp03t,
    //                 targetRunno,
    //                 currentYear,
    //                 empno,
    //             );
    //             await this.taxAs400Repo.update(filter, mappedAs400);
    //         }

    //         // อัปเดต FORM
    //         await this.formRepo.update(filter, {
    //             CST: dto.action.toString(),
    //             DREQDATE: today,
    //             CREQTIME: timeStr,
    //             VREMARK: dto.comment || '',
    //         });

    //         // ถ้า Submit (action = 1) ให้อัปเดต Flow ขั้นตอน Requester
    //         if (dto.action === 1) {
    //             await this.flowRepo.update(
    //                 {
    //                     ...filter,
    //                     CSTEPNO: '--',
    //                     VAPVNO: empno,
    //                 },
    //                 {
    //                     DAPVDATE: today,
    //                     CAPVTIME: timeSecStr,
    //                     CSTEPST: '1',
    //                 },
    //             );
    //         }

    //         return {
    //             status: 'success',
    //             message:
    //                 dto.action === 1
    //                     ? 'ยื่นแบบคำขอลดหย่อนภาษีสำเร็จ'
    //                     : 'บันทึกแบบร่างสำเร็จ',
    //             runno: targetRunno,
    //             year: currentYear,
    //         };
    //     } else {
    //         // === สร้างคำขอใหม่ ===
    //         // หา Next NRUNNO
    //         const lastForm = await this.formRepo.findOne({
    //             where: {
    //                 NFRMNO: this.NFRMNO,
    //                 VORGNO: this.VORGNO,
    //                 CYEAR: this.CYEAR,
    //                 CYEAR2: currentYear,
    //             },
    //             order: { NRUNNO: 'DESC' },
    //         });
    //         const nextRunno = lastForm ? lastForm.NRUNNO + 1 : 1;

    //         // 1. Insert FORM
    //         const newForm = this.formRepo.create({
    //             NFRMNO: this.NFRMNO,
    //             VORGNO: this.VORGNO,
    //             CYEAR: this.CYEAR,
    //             CYEAR2: currentYear,
    //             NRUNNO: nextRunno,
    //             VREQNO: empno,
    //             VINPUTER: empno,
    //             DREQDATE: today,
    //             CREQTIME: timeStr,
    //             CST: dto.action.toString(),
    //             VFORMPAGE: '/form/gpform/tax/index.asp',
    //             VREMARK: dto.comment || '',
    //         });
    //         await this.formRepo.save(newForm);

    //         // 2. Insert FLOW Steps (Requester Step '--' + HR Approver Step '08')
    //         const flowReq = this.flowRepo.create({
    //             NFRMNO: this.NFRMNO,
    //             VORGNO: this.VORGNO,
    //             CYEAR: this.CYEAR,
    //             CYEAR2: currentYear,
    //             NRUNNO: nextRunno,
    //             CSTEPNO: '--',
    //             CSTEPNEXTNO: '08',
    //             CSTART: '1',
    //             CSTEPST: dto.action === 1 ? '1' : '0',
    //             CTYPE: '3',
    //             VAPVNO: empno,
    //             VREPNO: empno,
    //             DAPVDATE: dto.action === 1 ? today : null,
    //             CAPVTIME: dto.action === 1 ? timeSecStr : null,
    //         });

    //         const flowAppr = this.flowRepo.create({
    //             NFRMNO: this.NFRMNO,
    //             VORGNO: this.VORGNO,
    //             CYEAR: this.CYEAR,
    //             CYEAR2: currentYear,
    //             NRUNNO: nextRunno,
    //             CSTEPNO: '08',
    //             CSTEPNEXTNO: '00',
    //             CSTART: '0',
    //             CSTEPST: '0',
    //             CTYPE: '3',
    //             VAPVNO: this.HR_APPROVER,
    //             VREPNO: this.HR_APPROVER,
    //         });

    //         await this.flowRepo.save([flowReq, flowAppr]);

    //         // 3. Insert GPLY01_TAX
    //         const mappedTax = this.mapTaxDtoToEntity(
    //             dto,
    //             nextRunno,
    //             currentYear,
    //         );
    //         const newTax = this.taxRepo.create(mappedTax);
    //         await this.taxRepo.save(newTax);

    //         // 4. Insert GPLY01_TAXAS400 (Snapshot)
    //         if (emp03t) {
    //             const mappedAs400 = this.mapEmp03tToAs400(
    //                 emp03t,
    //                 nextRunno,
    //                 currentYear,
    //                 empno,
    //             );
    //             const newAs400 = this.taxAs400Repo.create(mappedAs400);
    //             await this.taxAs400Repo.save(newAs400);
    //         }

    //         return {
    //             status: 'success',
    //             message:
    //                 dto.action === 1
    //                     ? 'ยื่นแบบคำขอลดหย่อนภาษีสำเร็จ'
    //                     : 'บันทึกแบบร่างสำเร็จ',
    //             runno: nextRunno,
    //             year: currentYear,
    //         };
    //     }
    // }

    /**
     * อนุมัติหรือส่งกลับแก้ไขคำขอลดหย่อนภาษี (Approve / Reject)
     */
    // async approveTax(dto: ApproveTaxDto, approverEmpno: string) {
    //     const filter = {
    //         NFRMNO: this.NFRMNO,
    //         VORGNO: this.VORGNO,
    //         CYEAR: this.CYEAR,
    //         CYEAR2: dto.year,
    //         NRUNNO: dto.runno,
    //     };

    //     const form = await this.formRepo.findOne({ where: filter });
    //     if (!form) {
    //         throw new NotFoundException(
    //             `Tax form not found for year ${dto.year} and runno ${dto.runno}`,
    //         );
    //     }

    //     const today = new Date();
    //     const timeSecStr = today.toTimeString().substring(0, 8);

    //     // อัปเดต Flow ขั้นตอนการอนุมัติ (Step '08')
    //     await this.flowRepo.update(
    //         {
    //             ...filter,
    //             CSTEPNO: '08',
    //         },
    //         {
    //             DAPVDATE: today,
    //             CAPVTIME: timeSecStr,
    //             VREALAPV:
    //                 approverEmpno || dto.approverEmpno || this.HR_APPROVER,
    //             VREMARK: dto.remark || '',
    //             CSTEPST: dto.action === 2 ? '1' : '2', // 1: Pass/Approve, 2: Reject
    //         },
    //     );

    //     // อัปเดตสถานะใน FORM (2: ปรับปรุงข้อมูลเรียบร้อยแล้ว, 3: กรุณาตรวจสอบ/แก้ไขข้อมูลใหม่)
    //     await this.formRepo.update(filter, {
    //         CST: dto.action.toString(),
    //         VREMARK: dto.remark || form.VREMARK,
    //     });

    //     return {
    //         status: 'success',
    //         message:
    //             dto.action === 2
    //                 ? 'อนุมัติคำขอลดหย่อนภาษีเรียบร้อยแล้ว'
    //                 : 'ส่งกลับแก้ไขคำขอเรียบร้อยแล้ว',
    //     };
    // }

    /**
     * ข้อมูลสำหรับพิมพ์เอกสาร ล.ย.01 PDF
     */
    // async getPrintData(
    //     type: number,
    //     year: string,
    //     runno: number,
    //     empno: string,
    // ) {
    //     if (type === 1) {
    //         // ดึงข้อมูลภาษีปัจจุบัน
    //         return await this.findCurrentTax(empno);
    //     } else {
    //         // ดึงข้อมูลจากใบคำขอที่เลือก
    //         const detail = await this.findRequestDetail(year, runno, empno);
    //         return detail.formatted;
    //     }
    // }

    /**
     * คำนวณและจัดรูปแบบข้อมูลลดหย่อนภาษี 18 รายการ (setTax Logic จาก CodeIgniter)
     * @param data ข้อมูลต้นฉบับ (EMP03T หรือ GPLY01_TAX)
     * @param type 1: จาก EMP03T (AS400), 2: จาก GPLY01_TAX (Webform)
     */
    private formatTax(data: any, type: number, reqDate?: Date) {
        // หากส่งมาเป็น Array ให้ดึงแถวแรกออกมาใช้งาน
        const row = Array.isArray(data) ? data[0] || {} : data || {};

        // คำนวณบุตร
        const c1ied = type === 1 ? row.C1IED || 0 : row.FAMIED || 0;
        const c1ned = type === 1 ? row.C1NED || 0 : row.FAMNED || 0;
        const c2ied = type === 1 ? row.C2IED || 0 : row.FAMIED1 || 0;
        const c2ned = type === 1 ? row.C2NED || 0 : row.FAMNED1 || 0;
        const tax3 = (c1ied + c1ned) * 30000 + (c2ied + c2ned) * 60000;

        // คำนวณบิดา-มารดา
        const dad = (row.TAXEMF || '').toString().trim();
        const mom = (row.TAXEMM || '').toString().trim();
        const wdad = (row.TAXSFT || '').toString().trim();
        const wmom = (row.TAXSPM || '').toString().trim();
        let tax4 = 0;
        if (dad !== '') tax4 += 30000;
        if (mom !== '') tax4 += 30000;
        if (wdad !== '') tax4 += 30000;
        if (wmom !== '') tax4 += 30000;

        // คำนวณคู่สมรส
        const cleanStatus = (row.MARSTE || '').replace(/\s+/g, '').toUpperCase();
        const isSpouseNotWork = cleanStatus === 'MARRIED&SPOUSEDOESNOTWORK';
        const tax2 = isSpouseNotWork ? 60000 : 0;

        const taxPreg = type === 1 ? row.TAXPRG || 0 : row.TAXPREG || 0;
        const taxPens = type === 1 ? row.TAXANU || 0 : row.TAXPENS || 0;

        const tax5 = parseFloat(row.TAXDIS || 0);
        const tax6 = parseFloat(taxPreg);
        const tax7 = parseFloat(row.TAXINS || 0);
        const tax8 = parseFloat(row.TAXSIN || 0);
        const tax9 = parseFloat(row.TAXINH || 0);
        const tax10 = parseFloat(row.TAXINP || 0);
        const tax11 = parseFloat(row.TAXLTF || 0);
        const tax12 = parseFloat(row.TAXRMF || 0);
        const tax13 = parseFloat(taxPens);
        const tax14 = parseFloat(row.TAXEDU || 0);
        const tax15 = parseFloat(row.TAXDON || 0);
        const tax16 = parseFloat(row.TAXINL || 0);
        const tax17 = parseFloat(row.TAXOT1 || 0);
        const tax18 = parseFloat(row.TAXOT2 || 0);

        const numberData: Record<string, number> = {
            // Legacy / UI keys
            tax1: 60000,
            tax2: tax2,
            tax3: tax3,
            tax4: tax4,
            tax5: tax5,
            tax6: tax6,
            tax7: tax7,
            tax8: tax8,
            tax9: tax9,
            tax10: tax10,
            tax11: tax11,
            tax12: tax12,
            tax13: tax13,
            tax14: tax14,
            tax15: tax15,
            tax16: tax16,
            tax17: tax17,
            tax18: tax18,

            // Database column keys (GPLY01_TAX)
            FAMCHI: tax3,
            TAXDIS: tax5,
            TAXPREG: tax6,
            TAXINS: tax7,
            TAXSIN: tax8,
            TAXINH: tax9,
            TAXINP: tax10,
            TAXLTF: tax11,
            TAXRMF: tax12,
            TAXPENS: tax13,
            TAXEDU: tax14,
            TAXDON: tax15,
            TAXINL: tax16,
            TAXOT1: tax17,
            TAXOT2: tax18,
        };

        const total =
            60000 +
            tax2 +
            tax3 +
            tax4 +
            tax5 +
            tax6 +
            tax7 +
            tax8 +
            tax9 +
            tax10 +
            tax11 +
            tax12 +
            tax13 +
            tax14 +
            tax15 +
            tax16 +
            tax17 +
            tax18;

        numberData['total'] = total;
        numberData['other'] = tax17 + tax18;

        const updateDate = reqDate
            ? reqDate.toISOString().split('T')[0]
            : type === 1
              ? new Date().toISOString().split('T')[0]
              : row.CYEAR2;

        const detailData = {
            fyear: type === 1 ? new Date().getFullYear().toString() : row.CYEAR2,
            eng_status: (row.MARSTE || '').trim(),
            thai_status: (row.MARSTT || '').trim(),
            wife_name: row.FAMSNA || '',
            gotohell_date: row.FAMMRD ? row.FAMMRD.toString() : '',
            dad_id: dad,
            mom_id: mom,
            wifedad_id: wdad,
            wifemom_id: wmom,
            child1e: c1ied,
            child1n: c1ned,
            child2e: c2ied,
            child2n: c2ned,

            // Database column keys
            MARSTE: (row.MARSTE || '').trim(),
            MARSTT: (row.MARSTT || '').trim(),
            FAMSNA: row.FAMSNA || '',
            FAMMRD: row.FAMMRD ? row.FAMMRD.toString() : '',
            TAXEMF: dad,
            TAXEMM: mom,
            TAXSFT: wdad,
            TAXSPM: wmom,
            FAMIED: c1ied,
            FAMNED: c1ned,
            FAMIED1: c2ied,
            FAMNED1: c2ned,
            update_date: updateDate,
        };

        return {
            number: numberData,
            detail: detailData,
        };
    }

    /**
     * คืนค่าผลลัพธ์ว่างเริ่มต้นสำหรับพนักงานใหม่ที่ยังไม่มีประวัติใน EMP03T
     */
    private buildDefaultTaxResponse(empno: string) {
        return {
            number: {
                tax1: 60000,
                tax2: 0,
                tax3: 0,
                tax4: 0,
                tax5: 0,
                tax6: 0,
                tax7: 0,
                tax8: 0,
                tax9: 0,
                tax10: 0,
                tax11: 0,
                tax12: 0,
                tax13: 0,
                tax14: 0,
                tax15: 0,
                tax16: 0,
                tax17: 0,
                tax18: 0,

                // Database column keys
                FAMCHI: 0,
                TAXDIS: 0,
                TAXPREG: 0,
                TAXINS: 0,
                TAXSIN: 0,
                TAXINH: 0,
                TAXINP: 0,
                TAXLTF: 0,
                TAXRMF: 0,
                TAXPENS: 0,
                TAXEDU: 0,
                TAXDON: 0,
                TAXINL: 0,
                TAXOT1: 0,
                TAXOT2: 0,

                total: 60000,
                other: 0,
            },
            detail: {
                fyear: new Date().getFullYear().toString(),
                eng_status: 'SINGLE',
                thai_status: 'โสด',
                wife_name: '',
                gotohell_date: '',
                dad_id: '',
                mom_id: '',
                wifedad_id: '',
                wifemom_id: '',
                child1e: 0,
                child1n: 0,
                child2e: 0,
                child2n: 0,

                // Database column keys
                MARSTE: 'SINGLE',
                MARSTT: 'โสด',
                FAMSNA: '',
                FAMMRD: '',
                TAXEMF: '',
                TAXEMM: '',
                TAXSFT: '',
                TAXSPM: '',
                FAMIED: 0,
                FAMNED: 0,
                FAMIED1: 0,
                FAMNED1: 0,
                update_date: new Date().toISOString().split('T')[0],
            },
        };
    }
}
