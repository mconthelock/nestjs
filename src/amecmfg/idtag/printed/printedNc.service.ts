import * as fs from 'fs/promises';
import * as path from 'path';
import * as dayjs from 'dayjs';

import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { exportExcel } from 'src/common/helpers/file-excel.helper';
import { MailService } from 'src/common/services/mail/mail.service';
import { IdTagRepository } from './idtag.repository';
import { filesData, PrintedService } from './printed.service';
import { PDFDocument, rgb } from 'pdf-lib';
import { writeLineBox } from 'src/common/helpers/file-pdf.helper';
import { PrintedMergeService } from './printedMerge.service';

@Injectable()
export class PrintedNcService {
    constructor(
        @Inject(forwardRef(() => PrintedService))
        private readonly printed: PrintedService,
        private readonly merge: PrintedMergeService,
        private readonly repo: IdTagRepository,
        private readonly mail: MailService,
    ) {}

    //Job scheduling for NC Detail
    async notifyNcDetail() {
        const templatePath = path.join(
            process.env.IDTAG_FILE_PATH,
            `templates/NC Detail Template.xlsx`,
        );
        const exportFileName = `NC Detail ${dayjs().format('YYYYMMDD_HHmmss')}.xlsx`;
        const data = await this.repo.findAllNc({
            filters: [{ field: 'TASKNAME', op: 'isNull' }],
        });

        try {
            const attachment = await exportExcel({
                templatePath,
                filename: exportFileName,
                data,
            });

            const mailSent = await this.mail.sendMail({
                to: 'chalorms@MitsubishiElevatorAsia.co.th',
                subject: `NC Detail Report - ${dayjs().format('YYYY-MM-DD')}`,
                html: '',
                attachments: [
                    {
                        filename: exportFileName,
                        content: attachment,
                    },
                ],
            });
            console.log(mailSent);
        } catch (error) {
            throw new Error(
                `Error generating NC Detail Excel: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    async processNcDetail() {
        const data = await this.repo.findAllNc({
            filters: [
                { field: 'TASKNAME', op: 'isNotNull' },
                { field: 'PAGE_NC', op: 'eq', value: '0' },
            ],
        });
        try {
            if (!data.length) return;

            const grouped = new Map<number, any[]>();
            for (const row of data) {
                const group = grouped.get(row.FILES_ID) || [];
                group.push(row);
                grouped.set(row.FILES_ID, group);
            }

            for (const [filesId, item] of grouped) {
                const dbData: filesData = {
                    bmdate: item[0].SCHDDATE,
                    folder: item[0].FILE_FOLDER,
                    originalfilename: `${item[0].FILE_ONAME.replace(/\.pdf$/i, '')}(${item[0].TASKNAME}).pdf`,
                    filename: item[0].FILE_ONAME,
                    pageCount: item.length,
                    schd_number: item[0].SCHDNUMBER,
                    schd_txt: item[0].SCHDCHAR,
                    schdp: item[0].SCHDP,
                    parentFileId: filesId,
                };
                const tagData = await this.printed.saveTagsData(dbData);

                await this.repo.updateFiles({
                    FILES: filesId,
                    FILE_PRINTEDPAGE: item[0].FILE_PRINTEDPAGE + item.length,
                });

                const splitFilesData: {
                    fileName: string;
                    filePath: string;
                    pageNumber: number;
                }[] = [];

                const pdfContext = await this.printed.setPdfPath({
                    ...dbData,
                    schd_p: item[0].SCHDP,
                    filedir: item[0].FILE_FOLDER,
                    filename: item[0].FILE_ONAME,
                });
                for (const row of item) {
                    const pdfPath = path.join(
                        pdfContext.pdfDirectory,
                        `${row.PAGE_TAG}.pdf`,
                    );

                    await this.printed.writeLog(
                        `Processing NC Detail for ${dbData.originalfilename}, PAGE_TAG ${row.PAGE_TAG}`,
                    );

                    try {
                        await this.embedNCToPdf(pdfPath, row.TAGMARK);
                        await this.printed.writeLog(
                            `Put NC No. ${row.TAGMARK} to ${row.PAGE_TAG}`,
                        );

                        splitFilesData.push({
                            fileName: row.PAGE_TAG,
                            filePath: pdfPath,
                            pageNumber: row.PAGE_NUM,
                        });
                    } catch (error) {
                        await this.printed.writeLog(
                            `Error processing CN Data for tag ${row.PAGE_TAG}`,
                            error instanceof Error
                                ? error.message
                                : String(error),
                        );
                    }
                }

                await this.repo.updatePages(
                    splitFilesData.map((file) => ({
                        FILES_ID: filesId,
                        PAGE_NUM: file.pageNumber,
                        NEXT_FILES_ID: tagData.FILES,
                        PAGE_NC: '1',
                    })),
                );
                await this.repo.updateFiles({
                    FILES: tagData.FILES,
                    FILE_STATUS: 2,
                });

                const outputPath = path.join(
                    pdfContext.pdfDirectory,
                    dbData.filename,
                );
                const filnalFilePath = path.join(
                    pdfContext.pdfDirectory,
                    dbData.originalfilename,
                );
                await this.merge.mergePdfsFast(splitFilesData, outputPath);
                await fs.rename(outputPath, filnalFilePath);
                await this.printed.writeLog(
                    `Merged NC Detail PDF for ${dbData.originalfilename}`,
                );
            }
        } catch (error) {
            throw new Error(
                `Error processing NC Detail: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    async embedNCToPdf(pdfPath: string, ncData: string) {
        const pdfBytes = await fs.readFile(pdfPath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const [page] = pdfDoc.getPages();
        const opt = {
            pdfpage: page,
            fontsize: 14,
            boxHeight: 15,
        };

        await writeLineBox({
            ...opt,
            text: `${ncData}`,
            align: 'right',
            boxX: 260,
            boxY: 790,
            boxWidth: 300,
            // drawBorder: {
            //     color: rgb(0.9, 0.9, 0.9),
            //     width: 0.5,
            //     bgColor: rgb(1, 0.9, 0.9),
            // },
        });
        await fs.writeFile(pdfPath, await pdfDoc.save());
    }
}
