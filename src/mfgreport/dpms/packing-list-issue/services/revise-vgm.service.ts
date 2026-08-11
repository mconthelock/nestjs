import { Injectable } from '@nestjs/common';

import { setListForHtml } from '../builders/list.builder';

import { now } from 'src/common/utils/dayjs.utils';
import { deleteFile, joinPaths } from 'src/common/utils/files.utils';
import { log_message, IlogMessage } from 'src/common/utils/transform';

import { CreatePackingListIssueDto } from '../dto/create-packing-list-issue.dto';

import { IplHeader } from '../interface/html.interface';

import { GenPdfService } from './pdf.service';
import { DpmsPlCaseListService } from 'src/workload/dpms_pl_case_list/dpms_pl_case_list.service';
import { DpmsPlIssueRevService } from 'src/workload/dpms_pl_issue_rev/dpms_pl_issue_rev.service';
import { DpmsPlWeightChangeService } from 'src/workload/dpms_pl_weight_change/dpms_pl_weight_change.service';
import { DpmsPlIssueService } from 'src/workload/dpms_pl_issue/dpms_pl_issue.service';
import { DpmsPlIssueTypeService } from 'src/workload/dpms_pl_issue_type/dpms_pl_issue_type.service';
import { DpmsPlDocRevService } from 'src/workload/dpms_pl_doc_rev/dpms_pl_doc_rev.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { HtmlService } from './html.service';
import { IssueService } from './issue.service';
import { DpmsPlIssueDateService } from 'src/workload/dpms_pl_issue_date/dpms_pl_issue_date.service';
import { DpmsPlFileService } from 'src/workload/dpms_pl_file/dpms_pl_file.service';
import { DpmsPlCaseListDetailService } from 'src/workload/dpms_pl_case_list_detail/dpms_pl_case_list_detail.service';
import { ExcelService } from './excel.service';
import { S020kpService } from 'src/datacenter/s020kp/s020kp.service';
import { S049kpService } from 'src/datacenter/s049kp/s049kp.service';

@Injectable()
export class ReviseVgmService extends IssueService {
    constructor(
        protected readonly dateService: DpmsPlIssueDateService,
        protected readonly fileService: DpmsPlFileService,
        protected readonly caseListDetailService: DpmsPlCaseListDetailService,
        protected readonly excelService: ExcelService,

        protected readonly issueService: DpmsPlIssueService,
        protected readonly revService: DpmsPlIssueRevService,
        protected readonly issueTypeService: DpmsPlIssueTypeService,
        protected readonly docRevService: DpmsPlDocRevService,
        protected readonly mailService: MailService,
        protected readonly caseListService: DpmsPlCaseListService,
        protected readonly changeWeightService: DpmsPlWeightChangeService,
        protected readonly pdfService: GenPdfService,
        protected readonly htmlService: HtmlService,
        private readonly s020kpService: S020kpService,
        private readonly s049kpService: S049kpService,
    ) {
        super(
            issueService,
            revService,
            issueTypeService,
            docRevService,
            mailService,
            dateService,
            fileService,
            caseListService,
            caseListDetailService,
            excelService,
            pdfService,
        );
    }

    async reviseVgm(vanndate?: string) {
        const logMessage: IlogMessage[] = [log_message('Job started')];
        const runDate = now('YYYY-MM-DD HH:mm:ss');
        let subject: string = `DPMS PL Auto revise VGM Job Log  [${process.env.STATE}] - ${runDate}`;
        const listFilePath: {
            fileName: string;
            filePath: string;
            type: 'pdf' | 'excel';
        }[] = [];
        try {
            if (!vanndate) {
                vanndate = now();
            }
            logMessage.push(
                log_message(`Revising VGM for vanndate ${vanndate}`),
            );
            // ดึงรายการเปลี่ยนแปลงน้ำหนักตามวัน vanning ที่กำหนด
            const changeLists =
                await this.changeWeightService.getChangeWeight(vanndate);
            if (!changeLists.status) {
                return {
                    status: false,
                    message: 'No change weight data found',
                };
            }
            const issueDate: string = now('DD/MM/YYYY');
            for (const change of changeLists.data) {
                const issueRevId: number = change.NISSUEREV_ID;

                logMessage.push(
                    log_message(
                        `Revising VGM for Order: [${change.VMFGNO}] - NISSUEREV_ID: ${issueRevId}`,
                    ),
                );

                const issueRev = await this.revService.findByRevId(issueRevId);
                if (!issueRev.status) {
                    logMessage.push(
                        log_message(
                            `No DPMS PL Issue found for NISSUEREV_ID: ${issueRevId}`,
                        ),
                    );
                    continue;
                }
                const revData = issueRev.data[0];

                const plHeader: IplHeader = {
                    VSHOPORDERNO: revData.VSHOPORDERNO,
                    VSUBJECT: revData.VSUBJECT,
                    VNAMEOFBLDG: revData.VNAMEOFBLDG,
                    VSOLDTO: revData.VSOLDTO,
                };
                const round: number | null = revData.NROUND;
                const shippingMark: string = revData.VSHIPPINGMARK;

                const { html, plList, lists, status, message } =
                    await this.generateHtml({
                        id: issueRevId,
                        logMessage: logMessage,
                        revData: revData,
                        issueDate: issueDate,
                    });
                logMessage.push(log_message(`${message}`));
                if (!status) {
                    continue;
                }

                const data: CreatePackingListIssueDto = {
                    VPROD: revData.VPROD,
                    VP: revData.VP,
                    VTYPE: revData.VTYPE,
                    VORDERS: revData.VORDERS,
                    LIST: lists,
                    HTML: html,
                    PO: false,
                    POLIST: [],
                    POHTML: '',
                    HEADER: plHeader,
                    SHIPPING_MARK: shippingMark,
                    NROUND: round,
                    ISSUETYPE: revData.ISSUE_TYPE.NID,
                    VISSUEBY: '0',
                    CHANGETYPE: false,
                    REVISE: true,
                    REVISEID: issueRevId,
                    CHANGELIST: false,
                    NEWLIST: false,
                };

                if (change.NPOID) {
                    logMessage.push(
                        log_message(`Revising VGM for POID: ${change.NPOID}`),
                    );
                    const { html, plList, lists, status, message } =
                        await this.generateHtml({
                            id: change.NPOID,
                            logMessage: logMessage,
                            revData: revData,
                            issueDate: issueDate,
                        });
                    logMessage.push(log_message(`${message}`));
                    if (!status) {
                        continue;
                    }
                    data.PO = true;
                    data.POLIST = lists;
                    data.POHTML = html;
                }

                const res = await this.issue(data, false);

                listFilePath.push(...res.listFilePath);

                //  test generate pdf
                // await this.pdfService.generatePDF({
                //     order: revData.VORDERS,
                //     html: html,
                //     fileName: `test.pdf`,
                //     revision: revData.VREVTEXT,
                //     issueDate: issueDate,
                //     finalPath: `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/test/pdf`,
                // });
            }
            const attachments = [];
            for (const file of listFilePath) {
                const filePath: string = await joinPaths(
                    file.filePath,
                    file.fileName,
                );
                logMessage.push(
                    log_message(
                        `File generated: ${file.fileName} at ${filePath}`,
                    ),
                );
                attachments.push({
                    filename: file.fileName,
                    path: filePath,
                });
            }
            const context = changeLists.data.map((change) => ({
                VDESCRIPTION: change.PLTYPE,
                VORDERS: change.VMFGNO,
                VREVTEXT: change.REVISION,
                VSUBJECT: change.SUBJECT,
                PROJECT: change.PROJECT,
            }));
            await this.mailService.sendMail({
                from: `MFG REPORT System<${process.env.MAIL_FROM}>`,
                to: process.env.MAIL_ADMIN,
                subject: `Auto Revise PL Based on VGM ${runDate}`,
                template: 'mfgreport/dpms/packing-list',
                context: { list: context },
                bcc: process.env.MAIL_ADMIN,
                attachments: attachments,
            });

            return {
                status: true,
                message: `Retrieved ${changeLists.data.length} change weight records`,
                data: changeLists.data,
            };
        } catch (error) {
            subject = 'ERROR: ' + subject;
            logMessage.push(
                log_message(`Error revising VGM: ${error.message}`, 'error'),
            );
            for (const file of listFilePath) {
                const filePath: string = await joinPaths(
                    file.filePath,
                    file.fileName,
                );
                await deleteFile(filePath);
            }
            throw new Error(`Error revising VGM: ${error.message}`);
        } finally {
            logMessage.push(log_message('Job finished'));
            await this.mailService.sendMail({
                to: process.env.MAIL_ADMIN,
                subject: subject,
                template: 'job-log',
                context: logMessage,
            });
        }
    }

    private async generateHtml({
        id,
        logMessage,
        revData,
        issueDate,
    }: {
        id: number;
        logMessage: IlogMessage[];
        revData: any;
        issueDate: string;
    }) {
        try {
            const lists = await this.caseListService.findByRevId(id, true);
            const combine = await this.s020kpService.find(revData.VORDERS);
            const changeBlock = await this.s049kpService.find(revData.VORDERS);
            const listsData = lists.data.map(({ NID, ...list }) => {
                const details = list.DETAILS.map(({ NID, ...item }) => item);
                return { ...list, DETAILS: details };
            });

            logMessage.push(log_message(`Set list for HTML`));
            const plList = setListForHtml(lists.data, 'pdf');
            logMessage.push(log_message(`Generated HTML`));
            const html = await this.htmlService.generate({
                revData: revData,
                shippingMark: revData.VSHIPPINGMARK,
                lists: lists.data,
                plList: plList,
                issueDate: issueDate,
                combine: combine.data,
                changeBlock: changeBlock.data,
            });
            return {
                status: true,
                message: 'HTML generated successfully',
                html: html,
                plList: plList,
                lists: listsData,
            };
        } catch (error) {
            logMessage.push(
                log_message(`Error revising VGM: ${error.message}`),
            );
            return {
                status: false,
                message: `Error revising VGM: ${error.message}`,
            };
        }
    }
}
