import { Injectable } from '@nestjs/common';
import { log_message } from 'src/common/utils/transform';
import { IReviseParams, IReviseResult } from '../interface/revise.interface';

import { HtmlService } from './html.service';
import { DpmsPlIssueRevService } from 'src/workload/dpms_pl_issue_rev/dpms_pl_issue_rev.service';
import { CreatePackingListIssueDto } from '../dto/create-packing-list-issue.dto';
import { IplHeader } from '../interface/html.interface';
import { joinPaths } from 'src/common/utils/files.utils';
import { AttachmentDto } from 'src/common/services/mail/dto/attachment.dto';
import { IssueService } from './issue.service';
import { DpmsPlIssueService } from 'src/workload/dpms_pl_issue/dpms_pl_issue.service';
import { DpmsPlIssueTypeService } from 'src/workload/dpms_pl_issue_type/dpms_pl_issue_type.service';
import { DpmsPlDocRevService } from 'src/workload/dpms_pl_doc_rev/dpms_pl_doc_rev.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { DpmsPlIssueDateService } from 'src/workload/dpms_pl_issue_date/dpms_pl_issue_date.service';
import { DpmsPlFileService } from 'src/workload/dpms_pl_file/dpms_pl_file.service';
import { DpmsPlCaseListService } from 'src/workload/dpms_pl_case_list/dpms_pl_case_list.service';
import { DpmsPlCaseListDetailService } from 'src/workload/dpms_pl_case_list_detail/dpms_pl_case_list_detail.service';
import { ExcelService } from './excel.service';
import { GenPdfService } from './pdf.service';
import { IListFilePath } from '../interface/issue.interface';

@Injectable()
export class ReviseMainService extends IssueService {
    constructor(
        protected readonly issueService: DpmsPlIssueService,
        protected readonly typeService: DpmsPlIssueTypeService,
        protected readonly docRevService: DpmsPlDocRevService,
        protected readonly mailService: MailService,
        protected readonly dateService: DpmsPlIssueDateService,
        protected readonly fileService: DpmsPlFileService,
        protected readonly caseListService: DpmsPlCaseListService,
        protected readonly caseListDetailService: DpmsPlCaseListDetailService,
        protected readonly excelService: ExcelService,
        protected readonly pdfService: GenPdfService,

        private readonly htmlService: HtmlService,
        private readonly revService: DpmsPlIssueRevService,
    ) {
        super(
            issueService,
            revService,
            typeService,
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

    async revise({
        logMessage,
        issueDate,
        revid,
        poid,
        order,
        newShippingMark,
    }: IReviseParams): Promise<IReviseResult> {
        try {
            logMessage?.push(
                log_message(
                    `Revising for Order: [${order}] - NISSUEREV_ID: ${revid}`,
                ),
            );

            const issueRev = await this.revService.findByRevId(revid);
            if (!issueRev.status) {
                logMessage?.push(
                    log_message(
                        `No DPMS PL Issue found for NISSUEREV_ID: ${revid}`,
                    ),
                );
                return {
                    status: false,
                    message: `No DPMS PL Issue found for NISSUEREV_ID: ${revid}`,
                };
            }
            const revData = newShippingMark ?  {...issueRev.data[0], VSHIPPINGMARK: newShippingMark} : issueRev.data[0];

            const plHeader: IplHeader = {
                VSHOPORDERNO: revData.VSHOPORDERNO,
                VSUBJECT: revData.VSUBJECT,
                VNAMEOFBLDG: revData.VNAMEOFBLDG,
                VSOLDTO: revData.VSOLDTO,
            };

            const { html, plList, lists, status, message } =
                await this.htmlService.main({
                    id: revid,
                    logMessage: logMessage,
                    revData: revData,
                    issueDate: issueDate,
                });
            logMessage?.push(log_message(`${message}`));
            if (!status) {
                return {
                    status: false,
                    message: `Failed to generate HTML for NISSUEREV_ID: ${revid}`,
                };
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
                SHIPPING_MARK: revData.VSHIPPINGMARK,
                NROUND: revData.NROUND,
                ISSUETYPE: revData.ISSUE_TYPE.NID,
                VISSUEBY: '0',
                CHANGETYPE: false,
                REVISE: true,
                REVISEID: revid,
                CHANGELIST: false,
                NEWLIST: false,
            };

            if (poid) {
                logMessage?.push(log_message(`Revising for POID: ${poid}`));
                const { html, plList, lists, status, message } =
                    await this.htmlService.main({
                        id: poid,
                        logMessage: logMessage,
                        revData: revData,
                        issueDate: issueDate,
                    });
                logMessage?.push(log_message(`${message}`));
                if (!status) {
                    return {
                        status: false,
                        message: `Failed to generate HTML for NPOID: ${poid}`,
                    };
                }
                data.PO = true;
                data.POLIST = lists;
                data.POHTML = html;
            }

            const res = await this.issue(data, false);
            if(!res.status) {
                return {
                    status: false,
                    message: `Failed to revise for Order: [${order}] - NISSUEREV_ID: ${revid}`,
                };
            }

            const listFilePath: IListFilePath[] = res.listFilePath;
            const attachments: AttachmentDto[] = [];
            for (const file of listFilePath) {
                const filePath: string = await joinPaths(
                    file.filePath,
                    file.fileName,
                );
                logMessage?.push(
                    log_message(
                        `File generated: ${file.fileName} at ${filePath}`,
                    ),
                );
                attachments.push({
                    filename: file.fileName,
                    path: filePath,
                });
            }

            return {
                status: true,
                message: `Successfully revised for Order: [${order}] - NISSUEREV_ID: ${revid}`,
                listFilePath: listFilePath,
                attachments: attachments,
                logMessage: logMessage,
            };
        } catch (error) {
            throw new Error(`Failed to revise : ${error.message}`);
        }
    }
}
