import { Injectable } from '@nestjs/common';
import { MailService } from 'src/common/services/mail/mail.service';
import { MailList } from './sp-mail-alert.interface';

@Injectable()
export class TaskscheduleService {
    constructor(private readonly mailService: MailService) {}

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
}
