import { Injectable } from '@nestjs/common';

import {
    DPMS_PL_ISSUE_PK,
    sendMailParams,
    generateFilenameParams,
    prepareDocRevisionDataParams,
    syncDocRevisionAndPlIssueParams,
    saveDocRevisionParams,
    IdocRevData,
} from './packing-list-issue.interface';

import { UpdatePlIssueProblemReasonDto } from './dto/update-packing-list-issue.dto';

import { joinPaths } from 'src/common/utils/files.utils';
import {
    convertJung,
    numberToAlphabetRevision,
} from 'src/common/utils/format.utils';

import { MailService } from 'src/common/services/mail/mail.service';
import { DpmsPlDocRevService } from 'src/workload/dpms_pl_doc_rev/dpms_pl_doc_rev.service';
import { DpmsPlIssueService } from 'src/workload/dpms_pl_issue/dpms_pl_issue.service';
import { DpmsPlIssueRevService } from 'src/workload/dpms_pl_issue_rev/dpms_pl_issue_rev.service';
import { DpmsPlIssueTypeService } from 'src/workload/dpms_pl_issue_type/dpms_pl_issue_type.service';

@Injectable()
export class PackingListIssueService {
    constructor(
        protected readonly dpmsPlIssueService: DpmsPlIssueService,
        protected readonly dpmsPlIssueRevService: DpmsPlIssueRevService,
        protected readonly dpmsPlIssueTypeService: DpmsPlIssueTypeService,
        protected readonly dpmsPlDocRevService: DpmsPlDocRevService,
        protected readonly mailService: MailService,
    ) {}

    private readonly finalDir = `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/mfgreport/packing-list/`;

    async updateProblemReason(dto: UpdatePlIssueProblemReasonDto) {
        try {
            const { VPROD, VP, VORDERS, VTYPE, ...data } = dto;
            const condition = {
                VPROD,
                VP,
                VORDERS,
                VTYPE,
            };
            const checkPlIssue =
                await this.dpmsPlIssueService.findOne(condition);
            if (!checkPlIssue.status) {
                return await this.dpmsPlIssueService.create({
                    ...condition,
                    ...data,
                });
            } else {
                return await this.dpmsPlIssueService.update(condition, data);
            }
        } catch (error) {
            throw new Error(
                `Failed to update problem reason: ${error.message}`,
            );
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-07-03
     * @description Generate final path for PDF file based on VPROD and VORDERS
     * @typedef genaratePath
     * @property {string} prod e.g. 2026021
     * @property {string} order e.g. EXS916013
     * @property {string} folderPath e.g. 'AMEC'
     * @returns {Promise<string>} finalPath e.g. \\amecnas\AMECWEB\File\development\mfgreport\packing-list\2026\02X\EXS916013
     * @example
     * const finalPath = await this.genaratePath({
     *   prod: '2026021',
     *   orders: 'EXS916013',
     *   folderPath: 'AMEC',
     * });
     * console.log(finalPath);  // \\amecnas\AMECWEB\File\development\mfgreport\packing-list\2026\02X\EXS916013\AMEC
     */
    protected async genaratePath({
        prod,
        orders,
        folderPath,
    }: {
        prod: string;
        orders: string;
        folderPath: string;
    }): Promise<string> {
        const converted = convertJung(prod);
        if (!converted) {
            throw new Error('Invalid VPROD format for converting Jung');
        }
        const fyear = converted.substring(0, 4);
        const jung = converted.slice(4);
        const finalPath = await joinPaths(
            this.finalDir,
            fyear,
            jung,
            orders,
            folderPath,
            // issueType.data.VDESCRIPTION,
        );
        return finalPath;
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-07-03
     * @description
     * เช็คเอกสาร Packing List Issue ว่ามี record อยู่แล้วหรือไม่
     * ถ้าไม่มีให้สร้างใหม่ และ set NDOCREV เป็น 0
     * ถ้ามีอยู่แล้ว ให้เช็คว่า DFINISHALL เป็น null หรือไม่
     *      ถ้าไม่เป็น null ให้เพิ่ม docRevision ขึ้น 1 และ set DFINISHALL เป็น null และ update NDOCREV เป็น docRevision ใหม่
     *      ถ้าเป็น null ให้ใช้ docRevision เดิม
     * @param plIssueData
     * @param changeIssueType ถ้าเป็น true ให้เพิ่ม docRevision ขึ้น 1 และ set DFINISHALL เป็น null และ update NDOCREV เป็น docRevision ใหม่
     * @param revise ถ้าเป็น true ให้เพิ่ม docRevision ขึ้น 1 และ set DFINISHALL เป็น null และ update NDOCREV เป็น docRevision ใหม่
     * @param typeCode ถ้าเป็น 'PT', 'SP', 'BL' ให้เพิ่ม docRevision ขึ้น 1 และ set DFINISHALL เป็น null และ update NDOCREV เป็น docRevision ใหม่
     * @returns
     * @example
     * const docRevision = await this.syncDocRevisionAndPlIssue({
     *      plIssueData: {
     *          VPROD: '2026021',
     *          VP: 'P3',
     *          VORDERS: 'EXS916013',
     *          VTYPE: 'ELE',
     *      },
     *      changeIssueType: true,
     *      revise: true,
     *      typeCode: 'PT',
     *      recreatedIssue: true,
     * });
     *
     */
    protected async syncDocRevisionAndPlIssue({
        plIssueData,
        changeIssueType = false,
        revise = false,
        typeCode,
        recreatedIssue,
    }: syncDocRevisionAndPlIssueParams): Promise<number> {
        let docRevision: number = 0;
        if (typeCode === 'DF') {
            return docRevision; // ถ้าเป็น Draft ให้ return 0 เพราะไม่ใช้
        }

        const checkPlIssue = await this.dpmsPlIssueService.findOne(plIssueData);
        // ถ้าเป็นการแก้ไขเอกสาร และ typeCode เป็น 'PT', 'SP', 'BL' ให้เพิ่ม docRevision ขึ้น 1
        if (revise && ['PT', 'SP', 'BL'].includes(typeCode)) {
            docRevision = checkPlIssue.data.NDOCREV + 1; // เพิ่ม revision ของเอกสาร
            // ถ้ารายการที่เคยเลือกมีการเปลี่ยนแปลง หรือมีรายการใหม่ ให้ set DFINISHALL เป็น null และ update NDOCREV เป็น docRevision ใหม่
            if (recreatedIssue) {
                await this.dpmsPlIssueService.update(plIssueData, {
                    DFINISHALL: null,
                    NDOCREV: docRevision,
                });
            }
        } else {
            // ถ้าไม่มี record ให้สร้างใหม่ และ set NDOCREV เป็น 0
            if (!checkPlIssue.status) {
                await this.dpmsPlIssueService.create({
                    ...plIssueData,
                    NDOCREV: docRevision,
                });
            }
            // ถ้ามี record อยู่แล้ว ให้เช็คว่า DFINISHALL เป็น null หรือไม่ ถ้าไม่เป็น null ให้เพิ่ม docRevision ขึ้น 1 และ set DFINISHALL เป็น null และ update NDOCREV เป็น docRevision ใหม่
            // 2026-03-06 ถ้า DFINISHALL เป็น null และมีการเปลี่ยนประเภทการออกเอกสาร
            else if (
                checkPlIssue.data.DFINISHALL ||
                (checkPlIssue.data.DFINISHALL === null && changeIssueType)
            ) {
                docRevision = (checkPlIssue.data.NDOCREV ?? 0) + 1; // เพิ่ม revision ของเอกสาร
                await this.dpmsPlIssueService.update(plIssueData, {
                    DFINISHALL: null,
                    NDOCREV: docRevision,
                });
            } else {
                docRevision = checkPlIssue.data.NDOCREV ?? 0; // กรณีเป็น null
            }
        }

        return docRevision;
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-07-03
     * @description เตรียมข้อมูลสำหรับการสร้าง record ใน DPMS_PL_DOC_REV และ update DFINISHALL ของ record ที่ยังไม่ finish ของเอกสารนี้
     * @param prepareDocRevisionDataParams
     * @returns
     * @example
     * const docRevData = await this.prepareDocRevisionData({
     *      typeCode: 'CP',
     *      plIssueData: {
     *          VPROD: '2026021',
     *          VP: 'P3',
     *          VORDERS: 'EXS916013',
     *          VTYPE: 'ELE',
     *      },
     *      finishDate: new Date(),
     *      docRevision: 0
     * });
     */
    protected async prepareDocRevisionData({
        typeCode,
        plIssueData,
        finishDate,
        docRevision,
        revise,
        recreatedIssue,
    }: prepareDocRevisionDataParams): Promise<IdocRevData> {
        // 2. ถ้าเป็น complete, combine, balance ให้ set DFINISHALL เป็นวันที่ issue เลย
        if (
            ['CP', 'CB', 'BL'].includes(typeCode) ||
            (revise && ['PT', 'SP'].includes(typeCode) && !recreatedIssue)
        ) {
            return {
                ...plIssueData,
                NREV: docRevision,
                DFINISHALL: finishDate,
            };
        } else {
            return {
                ...plIssueData,
                NREV: docRevision,
            };
        }
    }

    protected async saveDocRevision({
        typeCode,
        docRevData,
        issueRevID,
        revise,
        reviseID,
        recreatedIssue,
    }: saveDocRevisionParams) {
        const plIssueData = {
            VPROD: docRevData.VPROD,
            VP: docRevData.VP,
            VORDERS: docRevData.VORDERS,
            VTYPE: docRevData.VTYPE,
        };
        // ถ้า typeCode ไม่ใช่ Draft ให้สร้าง record ใน DPMS_PL_DOC_REV และ update DFINISHALL ของ record ที่ยังไม่ finish ของเอกสารนี้
        if (typeCode !== 'DF') {
            const docData = {
                ...docRevData,
                NISSUEREV_ID: issueRevID,
            };
            await this.dpmsPlDocRevService.create(docData);
            // หากเป็น Partial หรือ Separate และไม่มีการเปลี่ยนแปลงรายการ
            // ให้ update DFINISHALL และ ดึงรายการอื่นนอกจากรายการที่แก้ไขมาด้วย
            console.log('doc rev data ', docRevData);
            console.log('revise:', revise);
            console.log('typeCode:', typeCode);
            console.log('recreatedIssue:', recreatedIssue);
            if (
                revise &&
                ['PT', 'SP', 'BL'].includes(typeCode) &&
                !recreatedIssue
            ) {
                const previousRevision =
                    await this.dpmsPlDocRevService.findPreviousRevisionExcludingIssueRev(
                        {
                            ...plIssueData,
                            NREV: docRevData.NREV,
                            NISSUEREV_ID: reviseID,
                        },
                    );
                console.log('previousRevision:', previousRevision);
                for (const record of previousRevision.data) {
                    console.log('record:', record);
                    await this.dpmsPlDocRevService.create({
                        ...record,
                        NREV: docRevData.NREV,
                        DFINISHALL: docRevData.DFINISHALL ?? null,
                    });
                }
                console.log('docRevData.DFINISHALL:', docRevData.DFINISHALL);
                if (docRevData.DFINISHALL) {
                    await this.dpmsPlIssueService.update(plIssueData, {
                        DFINISHALL: docRevData.DFINISHALL,
                        NDOCREV: docRevData.NREV,
                    });
                }
                return;
            }
            // update DFINISHALL for pending records if any
            if (['CP', 'CB', 'BL'].includes(typeCode)) {
                // ดึงรายการ ที่ยังไม่ finish ของเอกสารนี้ เพื่อ update DFINISHALL เป็นวันที่ issue
                const pendingRecord =
                    await this.dpmsPlDocRevService.getPendingRecord({
                        ...plIssueData,
                        NREV: docRevData.NREV,
                    });

                if (pendingRecord.status) {
                    for (const record of pendingRecord.data) {
                        await this.dpmsPlDocRevService.create({
                            ...record,
                            DFINISHALL: docRevData.DFINISHALL,
                        });
                    }
                }
                await this.dpmsPlIssueService.update(plIssueData, {
                    DFINISHALL: docRevData.DFINISHALL,
                    NDOCREV: docRevData.NREV,
                });
            }
        }
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-07-03
     * @description หา revision ของเอกสาร Packing List Issue สำหรับการสร้าง record ใน DPMS_PL_ISSUE_REV
     * @param plIssueData
     * @returns
     */
    protected async getNextPlRevision({
        plIssueData,
        typeCode,
        typeId,
    }: {
        plIssueData: DPMS_PL_ISSUE_PK;
        typeCode: string;
        typeId: number;
    }): Promise<{ revision: number; revisionText: string }> {
        // 2026-06-27 เปลี่ยนเอา type และ round ออกจาก condition เพราะ revision จะไม่ขึ้นกับ type และ round แล้ว รันต่อเนื่องได้เลย
        // 2026-07-09 เพิ่ม typeId เพื่อใช้ในการหา revision ของ typeCode เป็น 'DF' (Draft) เพราะ Draft จะมี revision ต่อเนื่องแยกตาม typeId
        const draftTypeId =
            await this.dpmsPlIssueTypeService.findByTypeCode('DF');
        const revision: number =
            typeCode === 'DF'
                ? await this.dpmsPlIssueRevService.getNextRevision({
                      ...plIssueData,
                      NISSUE_TYPE: typeId,
                  })
                : await this.dpmsPlIssueRevService.getNextRevisionWithoutType(
                      {
                          ...plIssueData,
                          // NISSUE_TYPE: dto.ISSUETYPE,
                          // NROUND: dto.NROUND,
                      },
                      draftTypeId.data.NID,
                  );
        const revisionText: string = numberToAlphabetRevision(revision);
        return { revision, revisionText };
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-07-03
     * @description สร้างชื่อไฟล์สำหรับเอกสาร Packing List Issue
     * @param generateFilenameParams
     * @returns
     * @example
     * const fileName = this.generateFilename({
     *      revision: 0,
     *      revisionText: 'A',
     *      issueType: 'Partial',
     *      orders: 'EXS916013',
     *      projectName: 'GR425-25A IATRIKO MAROUSI'
     * });
     * console.log(fileName); // GR425-25A IATRIKO MAROUSI_EXS916013_A_Partial.pdf
     */
    protected generateFilename({
        revision,
        revisionText,
        issueType,
        orders,
        projectName,
        PO,
    }: generateFilenameParams): string {
        const fileName: string = `${projectName}_${orders}${revision > 0 ? `_${revisionText}` : ''}_${issueType}${PO ? `_(PO)` : ''}.pdf`;
        const newFileName: string = fileName.replace(/[\\/:*?"<>|]/g, '_');
        return newFileName;
    }

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-07-03
     * @description ส่งอีเมลแจ้งเตือนการออกเอกสาร Packing List Issue
     * @param sendMailParams
     * @returns
     * @example
     * await this.sendMail({
     *      maillist: ['sutthipongt@MitsubishiElevatorAsia.co.th'],
     *      context: {
     *          rev: 'A',
     *          issueType: 'Partial',
     *          shopOrderNo: 'E-XS-91601-3',
     *          subject: 'ELEVATOR (02X)G11L11',
     *          nameOfBldg: 'GR425-25A IATRIKO MAROUSI',
     *          soldTo: 'GR425-25A IATRIKO MAROUSI',
     *          path: '\\amecnas\AMECWEB\File\development\mfgreport\packing-list\2026\02X\EXS916013\GR425-25A IATRIKO MAROUSI_EXS916013_A_Partial.pdf',
     *      },
     *      attachments: [
     *        { filename: 'GR425-25A IATRIKO MAROUSI_EXS916013_A_Partial.pdf', content: <Buffer> },
     *      ],
     * });
     */
    protected async sendMail({
        maillist,
        context,
        attachments,
        subject = `Packing list issue notification`,
    }: sendMailParams) {
        const email =
            process.env.NODE_ENV != 'production'
                ? process.env.MAIL_ADMIN
                : maillist; //mails.data.map((mail) => mail.VEMAIL_ADDRESS);
        const state = process.env.STATE != 'production' ? '(TEST)' : '';
        await this.mailService.sendMail({
            from: `MFG REPORT System<${process.env.MAIL_FROM}>`,
            to: email,
            subject: `${subject} ${state}`,
            template: 'mfgreport/dpms/packing-list',
            context: {
                // name: email,
                rev: context.rev,
                issueType: context.issueType,
                shopOrderNo: context.shopOrderNo,
                subject: context.subject,
                nameOfBldg: context.nameOfBldg,
                soldTo: context.soldTo,
                path: context.path,
            },
            bcc: process.env.MAIL_ADMIN,
            attachments: attachments,
        });
    }
}
