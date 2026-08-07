import { Injectable } from '@nestjs/common';
import { PackingListIssueProcedureService } from '../packing-list-issue-procedure.service';
import { log_message, IlogMessage } from 'src/common/utils/transform';
import { now } from 'src/common/utils/dayjs.utils';
import { MailService } from 'src/common/services/mail/mail.service';
import { DpmsPlMailService } from 'src/workload/dpms_pl_mail/dpms_pl_mail.service';
import { joinPaths } from 'src/common/utils/files.utils';

@Injectable()
export class MarReportService {
    constructor(
        private readonly procedure: PackingListIssueProcedureService,
        private readonly mailService: MailService,
        private readonly dpmsPlMailService: DpmsPlMailService,
    ) {}

    /**
     * @author Sutthipong Tangmongkhoncharoen(24008)
     * @since 2026-08-07
     * @description ส่งรายการ packing list issue ให้ marketing ตาม project
     * @param round e.g. 1
     * @param date e.g. 2026-08-07
     * @returns
     */
    async sendMarReport(round: number, date?: string) {
        const logMessage: IlogMessage[] = [
            log_message('Job started'),
            log_message(`Sending MAR report for round ${round}`),
        ];
        let period: string = '';
        switch (round) {
            case 1:
                period = '15:00 - 08:00';
                logMessage.push(log_message('Round 1: 15:00 - 08:00'));
                break;
            case 2:
                period = '08:00 - 10:00';
                logMessage.push(log_message('Round 2: 08:00 - 10:00'));
                break;
            case 3:
                period = '10:00 - 12:00';
                logMessage.push(log_message('Round 3: 10:00 - 12:00'));
                break;
            case 4:
                period = '12:00 - 15:00';
                logMessage.push(log_message('Round 4: 12:00 - 15:00'));
                break;
        }
        const subject: string = `DPMS PL Mar Job Log  [${process.env.STATE}] - ${now('YYYY-MM-DD HH:mm:ss')}`;
        try {
            // ถ้าไม่มีการส่งวันที่เข้ามา ให้ใช้วันที่ปัจจุบัน
            if (!date) {
                date = now('YYYY-MM-DD');
            }

            // ดึงรายการ packing list issue ตามวันและรอบที่กำหนด
            const list = await this.procedure.getMarReport(date, round);
            if (!list.status) {
                logMessage.push(log_message(list.message));
                return {
                    status: false,
                    message: list.message,
                };
            }

            // จัดกลุ่มรายการตาม project
            const projectMap = list.data.reduce(
                (acc, item) => {
                    (acc[item.PROJECT] ??= []).push(item);
                    return acc;
                },
                {} as Record<string, typeof list.data>,
            );

            logMessage.push(log_message(`Total projects: ${Object.keys(projectMap).length} records`));

            // ดึงรายชื่ออีเมลจากฐานข้อมูล
            const mails = await this.dpmsPlMailService.findAll();
            if (!mails.status) {
                logMessage.push(log_message(mails.message));
                throw new Error('Failed to retrieve email addresses');
            }

            for (const [project, projectList] of Object.entries(projectMap)) {
                const lists = projectList as typeof list.data;
                logMessage.push(log_message(`Sending report for project: ${project}, records: ${lists.length}`));
                let attachments = [];
                // สร้าง path สำหรับไฟล์ PDF และ Excel และแนบไฟล์เหล่านั้นไปกับอีเมล
                for (const item of lists) {
                    const pdfPath = await joinPaths(item.PDFPATH, item.PDFNAME);
                    const excelPath = await joinPaths(
                        item.EXCELPATH,
                        item.EXCELNAME,
                    );
                    attachments.push(
                        {
                            filename: item.PDFNAME,
                            path: pdfPath,
                        },
                        {
                            filename: item.EXCELNAME,
                            path: excelPath,
                        },
                    );
                }
                const email =
                    process.env.NODE_ENV != 'production'
                        ? process.env.MAIL_ADMIN
                        : mails.data.map((mail) => mail.VEMAIL_ADDRESS);
                const state = process.env.STATE != 'production' ? '(TEST)' : '';
                await this.mailService.sendMail({
                    from: `MFG REPORT System<${process.env.MAIL_FROM}>`,
                    to: email,
                    subject: `Packing list issue notification [${project}]: ${period}  ${state}`,
                    template: 'mfgreport/dpms/packing-list',
                    context: {
                        list: lists,
                    },
                    bcc: process.env.MAIL_ADMIN,
                    attachments: attachments,
                });
            }
            return {
                status: true,
                message: 'MAR report sent successfully',
            }
        } catch (error) {
            throw new Error(`Error sending MAR report: ${error.message}`);
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
