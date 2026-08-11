import { Injectable } from '@nestjs/common';

import { setListForHtml } from '../builders/list.builder';

import { now } from 'src/common/utils/dayjs.utils';
import { log_message, IlogMessage } from 'src/common/utils/transform';

import { GenPdfService } from './pdf.service';
import { DpmsPlCaseListService } from 'src/workload/dpms_pl_case_list/dpms_pl_case_list.service';
import { DpmsPlIssueRevService } from 'src/workload/dpms_pl_issue_rev/dpms_pl_issue_rev.service';
import { DpmsPlWeightChangeService } from 'src/workload/dpms_pl_weight_change/dpms_pl_weight_change.service';
import { DpmsPlIssueService } from 'src/workload/dpms_pl_issue/dpms_pl_issue.service';
import { DpmsPlIssueTypeService } from 'src/workload/dpms_pl_issue_type/dpms_pl_issue_type.service';
import { DpmsPlDocRevService } from 'src/workload/dpms_pl_doc_rev/dpms_pl_doc_rev.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { HtmlService } from './html.service';
import { PackingListIssueService } from '../packing-list-issue.service';

@Injectable()
export class ReviseVgmService extends PackingListIssueService {
    constructor(
        protected readonly issueService: DpmsPlIssueService,
        protected readonly revService: DpmsPlIssueRevService,
        protected readonly issueTypeService: DpmsPlIssueTypeService,
        protected readonly docRevService: DpmsPlDocRevService,
        protected readonly mailService: MailService,
        private readonly caseListService: DpmsPlCaseListService,
        private readonly changeWeightService: DpmsPlWeightChangeService,
        private readonly pdfService: GenPdfService,
        private readonly htmlService: HtmlService,
    ) {
        super(
            issueService,
            revService,
            issueTypeService,
            docRevService,
            mailService,
        );
    }

    async reviseVgm(vanndate?: string) {
        const logMessage: IlogMessage[] = [log_message('Job started')];
        const subject: string = `DPMS PL Auto revise VGM Job Log  [${process.env.STATE}] - ${now('YYYY-MM-DD HH:mm:ss')}`;
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
            const issueDate = now('DD/MM/YYYY');
            for (const change of changeLists.data) {
                const issueRevId = [change.NISSUEREV_ID];
                if (change.NPOID) {
                    issueRevId.push(change.NPOID);
                }
                for (const id of issueRevId) {
                    logMessage.push(
                        log_message(`Revising VGM for NISSUEREV_ID: ${id}`),
                    );

                    const issueRev = await this.revService.findByRevId(id);
                    if (!issueRev.status) {
                        logMessage.push(
                            log_message(
                                `No DPMS PL Issue found for NISSUEREV_ID: ${id}`,
                            ),
                        );
                        continue;
                    }
                    const revData = issueRev.data[0];

                    const plHeader = {
                        VSHOPORDERNO: revData.VSHOPORDERNO,
                        VSUBJECT: revData.VSUBJECT,
                        VNAMEOFBLDG: revData.VNAMEOFBLDG,
                        VSOLDTO: revData.VSOLDTO,
                    };
                    const round = revData.NROUND;
                    const shippingMark = revData.VSHIPPINGMARK;

                    const lists = await this.caseListService.findByRevId(
                        id,
                        true,
                    );

                    logMessage.push(log_message(`Set list for HTML`));
                    const plList = setListForHtml(lists.data, 'pdf');

                    logMessage.push(log_message(`Generated HTML`));
                    const html = this.htmlService.generate({
                        revData: revData,
                        shippingMark: revData.VSHIPPINGMARK,
                        plList: plList,
                        issueDate: issueDate,
                    });

                    await this.pdfService.generatePDF({
                        order: revData.VORDERS,
                        html: html,
                        fileName: `test.pdf`,
                        revision: revData.VREVTEXT,
                        issueDate: issueDate,
                        finalPath: `${process.env.AMEC_FILE_PATH}/${process.env.STATE}/test/pdf`,
                    });
                }
            }

            return {
                status: true,
                message: `Retrieved ${changeLists.data.length} change weight records`,
                data: changeLists.data,
            };
        } catch (error) {
            logMessage.push(log_message(`Error revising VGM: ${error.message}`));
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
}
