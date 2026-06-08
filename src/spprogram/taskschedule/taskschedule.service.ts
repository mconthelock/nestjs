import { Injectable } from '@nestjs/common';
import { MailService } from 'src/common/services/mail/mail.service';
import { MailList } from './sp-mail-alert.interface';
import { InquiryService } from '../inquiry/inquiry.service';
import { PrebmService } from '../prebm/prebm.service';
import { TimelineService } from '../timeline/timeline.service';

@Injectable()
export class TaskscheduleService {
    constructor(
        private readonly mailService: MailService,
        private readonly inqs: InquiryService,
        private readonly prebm: PrebmService,
        private readonly timeline: TimelineService,
    ) {}

    async sendMail() {
        try {
            await this.mailService.sendMail({
                from: `SP Program <${process.env.MAIL_FROM}>`,
                to: `chalorms@MitsubishiElevatorAsia.co.th`,
                subject: 'Pending Form SAFETY INSPECTION REPORT Notification',
                template: 'spprogram/powerbi',
                context: [],
            });
            return true;
        } catch (error) {
            await this.mailService.sendMail({
                from: `SP Program <${process.env.MAIL_FROM}>`,
                to: process.env.MAIL_ADMIN,
                subject: 'Error in ST-INP Mail Alert Job',
                html: `<b>An error occurred while executing the ST-INP mail alert job:</b>
                <p>${error.message}</p>
                <br>
                <b>Stack Trace:</b>
                <p>${error.stack}</p>`,
            });
            throw new Error(`Failed to alert: ${error.message}`);
        }
    }

    async checkPrebm() {
        try {
            const inquiries = await this.inqs.search({
                INQ_STATUS: '< 60',
                IS_DETAILS: '1',
                IS_TIMELINE: '1',
            });
            const filteredInquiries = inquiries.filter(
                (dt) => dt.INQ_STATUS >= 30,
            );
            for (const inq of filteredInquiries) {
                const as400inq = await this.prebm.findAll({
                    filters: [{ field: 'Q6K101', op: 'eq', value: inq.INQ_NO }],
                });

                if (as400inq && as400inq.length > 0) {
                    const record = as400inq[0];
                    if (record.Q6K110 > 0 && record.Q6K110 > 0) {
                        const formattedDate = record.Q6K110.toString().replace(
                            /(\d{4})(\d{2})(\d{2})/,
                            '$1-$2-$3',
                        );
                        const formattedTime = `00${record.Q6K111.toString()}`
                            .slice(-6)
                            .replace(/(\d{2})(\d{2})(\d{2})/, '$1:$2:$3');
                        const bmConfirmDateTime = `${formattedDate} ${formattedTime}`;
                        await this.timeline.update({
                            INQ_NO: inq.INQ_NO,
                            INQ_REV: inq.INQ_REV,
                            BM_CONFIRM: new Date(bmConfirmDateTime),
                        });

                        console.log(inq.INQ_STATUS);

                        if (inq.INQ_STATUS == 30) {
                            await this.inqs.updatestatus(inq.INQ_ID, 31);
                        }
                    }
                }
            }
            return filteredInquiries;
        } catch (error) {
            throw new Error(`Failed to check prebm: ${error.message}`);
        }
    }
}
