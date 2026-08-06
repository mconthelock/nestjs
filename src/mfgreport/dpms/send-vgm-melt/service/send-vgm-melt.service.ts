import { Injectable } from '@nestjs/common';
import { SendVgmMeltRepository } from '../send-vgm-melt.repository';
import { MailService } from 'src/common/services/mail/mail.service';
import { formatDate } from 'src/common/utils/dayjs.utils';
import { sendMailParams } from '../interface/mail.interface';

@Injectable()
export class SendVgmMeltService {
    constructor(
        protected readonly repo: SendVgmMeltRepository,
        protected readonly mailService: MailService,
    ) {}

    async getList(vanndate: string) {
        try {
            const res = await this.repo.getList(vanndate);
            if (res.length === 0) {
                return {
                    status: false,
                    message: 'No data found',
                };
            }
            return {
                status: true,
                message: `Data found ${res.length} record(s)`,
                data: res,
            };
        } catch (error) {
            throw new Error(
                `Failed to get send VGM melt list: ${error.message}`,
            );
        }
    }

    async sendMail({ attachments, vanDate }: sendMailParams) {
        try {
            const vandate = formatDate(vanDate, 'DD MMM YY');
            const to =
                process.env.NODE_ENV != 'production'
                    ? process.env.MAIL_ADMIN
                    : [
                          'pannapa@MitsubishiElevatorAsia.co.th',
                          'meltratt@MitsubishiElevatorAsia.co.th',
                          'meltnamp@MitsubishiElevatorAsia.co.th',
                          'meltniya@MitsubishiElevatorAsia.co.th',
                      ];
            const cc =
                process.env.NODE_ENV != 'production'
                    ? []
                    : [
                          'pornpans@MitsubishiElevatorAsia.co.th',
                          'panompon@MitsubishiElevatorAsia.co.th',
                          'thanich@MitsubishiElevatorAsia.co.th',
                          'sirimol@mitsubishielevatorasia.co.th',
                          'thirat@MitsubishiElevatorAsia.co.th',
                          'paiboonj@MitsubishiElevatorAsia.co.th',
                      ];
            const state = process.env.STATE != 'production' ? '(TEST)' : '';
            const info = await this.mailService.sendMail({
                from: `MFG REPORT System<${process.env.MAIL_FROM}>`,
                to: to,
                cc: cc,
                subject: `VGM : Vanning on ${vandate} ${state}`,
                template: 'mfgreport/dpms/packing-list',
                html: `
                <p>G/W for project vanning on ${vandate}</p>
                <p>Please see attached file.</p>
            `,
                bcc: process.env.MAIL_ADMIN,
                attachments: attachments,
            });
            if (info.accepted.length > 0 && info.rejected.length === 0) {
                return {
                    status: true,
                    message: `Mail sent successfully `,
                };
            }
            return {
                status: false,
                message: `Mail failed to send`,
            };
        } catch (error) {
            throw new Error(`Failed to send mail: ${error.message}`);
        }
    }
}
