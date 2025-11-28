import { Injectable } from '@nestjs/common';
import { createMailTransporter } from 'src/common/helpers/mailer.helper';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  async sendMail(dto: SendMailDto) {
    const transporter = createMailTransporter(dto.host || process.env.MAIL_HOST, dto.port || process.env.MAIL_PORT);
    const bcc = dto.bcc
      ? Array.isArray(dto.bcc)
        ? [...dto.bcc, process.env.MAIL_ADMIN]
        : [dto.bcc, process.env.MAIL_ADMIN]
      : [process.env.MAIL_ADMIN];
    return await transporter.sendMail({
      from: dto.from || process.env.MAIL_FROM,
      to: dto.to || process.env.MAIL_ADMIN,
      subject: dto.subject || 'No Subject',
      html: dto.html || '<b>No Content</b>',
      cc: dto.cc,
      bcc: bcc,
      attachments: dto.attachments,
    });
  }
}
