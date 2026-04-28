import { Injectable } from '@nestjs/common';
import { createMailTransporter } from 'src/common/helpers/mailer.helper';
import { SendMailDto } from './dto/send-mail.dto';
import { renderMailTemplate } from 'src/common/helpers/mail-template.helper';

@Injectable()
export class MailService {
    async sendMail(dto: SendMailDto) {
        const transporter = createMailTransporter(
            dto.host || process.env.MAIL_HOST,
            dto.port || process.env.MAIL_PORT,
        );
        // const bcc = dto.bcc
        //   ? Array.isArray(dto.bcc)
        //     ? [...dto.bcc, process.env.MAIL_ADMIN]
        //     : [dto.bcc, process.env.MAIL_ADMIN]
        //   : [process.env.MAIL_ADMIN];
        const html =
            dto.html ??
            (dto.template
                ? await renderMailTemplate(dto.template, dto.context)
                : '<b>No Content</b>');
        return await transporter.sendMail({
            from: dto.from || process.env.MAIL_FROM,
            to: dto.to,
            subject: dto.subject || 'No Subject',
            html,
            cc: dto.cc,
            bcc: dto.bcc,
            attachments: dto.attachments,
        });
    }
}
