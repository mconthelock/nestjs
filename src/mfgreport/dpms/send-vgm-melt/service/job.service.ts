import { Injectable } from '@nestjs/common';
import { formatDate, now } from 'src/common/utils/dayjs.utils';
import { SendVgmMeltRepository } from '../send-vgm-melt.repository';
import { MailService } from 'src/common/services/mail/mail.service';
import { ExportExcelService } from './export-excel.service';
import { DpmsPlMeltLogService } from 'src/workload/dpms_pl_melt_log/dpms_pl_melt_log.service';
import { SendMailManualService } from './send-mail-manual.service';
import { DPMS_PL_MELT_REPORT, ListReport } from '../interface/main.interface';
import { log_message, IlogMessage } from 'src/common/utils/transform';

@Injectable()
export class JobService extends SendMailManualService {
    constructor(
        protected readonly repo: SendVgmMeltRepository,
        protected readonly mailService: MailService,
        protected readonly excelService: ExportExcelService,
        protected readonly logService: DpmsPlMeltLogService,
    ) {
        super(repo, mailService, excelService, logService);
    }

    /**
     * @author: Sutthipong Tangmongkhoncharoen(24008)
     * @since: 2026-08-06
     * @param date e.g. 2026-08-04
     * @returns
     */
    async job(date?: string): Promise<{ status: boolean; message: string }> {
        const logMessage: IlogMessage[] = [log_message('Job started')];
        const subject: string = `DPMS PL Melt Job Log  [${process.env.STATE}] - ${now('YYYY-MM-DD HH:mm:ss')}`;
        try {
            // แปลงวันที่ที่ได้รับมาเป็น Date object หรือใช้วันที่ปัจจุบันถ้าไม่มีการส่งเข้ามา
            let vanndate: Date = new Date();
            if (date) {
                vanndate = new Date(date + ' 00:00:00');
            }

            logMessage.push(
                log_message(`Processing vanndate: ${formatDate(vanndate)}`),
            );

            // เรียกใช้ฟังก์ชัน getList เพื่อดึงข้อมูลรายงานการส่ง VGM melt
            const lists: ListReport = await this.getList(
                formatDate(vanndate, 'YYYYMMDD'),
            );
            if (!lists.status) {
                logMessage.push(log_message(`No data found`, 'error'));
                return {
                    status: false,
                    message: `No data found`,
                };
            }

            // กรองรายการที่มี WAIT_FOR_MELT เป็น 'Y'
            const pendingList: DPMS_PL_MELT_REPORT[] = lists.data.filter(
                (item: DPMS_PL_MELT_REPORT) => item.WAIT_FOR_MELT === 'Y',
            );

            if (pendingList.length === 0) {
                logMessage.push(log_message(`No pending melt report found`, 'error'));
                return {
                    status: false,
                    message: `No pending melt report found`,
                };
            }

            // สร้าง Excel file และส่งเมลโดยเรียกใช้ฟังก์ชัน sendManualByUser
            const sendMail = await this.sendManualByUser({
                VANNDATE: vanndate,
                CREATEBY: 'system',
                DATA: pendingList,
            });

            if (!sendMail.status) {
                logMessage.push(
                    log_message(`Failed to send mail: ${sendMail.message}`, 'error'),
                );
                throw new Error(`Failed to send mail: ${sendMail.message}`);
            }
            logMessage.push(log_message(`Mail sent successfully`));
            return {
                status: true,
                message: `Job executed successfully`,
            };
        } catch (error) {
            logMessage.push(log_message(`Error occurred: ${error.message}`, 'error'));
            throw new Error(`Failed to execute job: ${error.message}`);
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
