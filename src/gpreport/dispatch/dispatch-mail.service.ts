import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import { ExportAndSendMailDto } from './dto/export-and-sendmail.dto';

@Injectable()
export class DispatchMailService {
  private getMailTransporter() {
    return nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT || 25),
      secure: false,
      auth: process.env.MAIL_USER
        ? {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
          }
        : undefined,
    });
  }

  async sendDispatchMail(params: {
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    html: string;
    attachments: string[];
  }) {
    const transporter = this.getMailTransporter();

    await transporter.sendMail({
      from: 'noreply@mitsubishielevatorasia.co.th',
      to: params.to,
      cc: params.cc,
      bcc: params.bcc,
      subject: params.subject,
      html: params.html,
      attachments: params.attachments.map((filePath) => ({
        filename: path.basename(filePath),
        path: filePath,
      })),
    });

    return { status: true };
  }

  buildDispatchMailHtml(dto: ExportAndSendMailDto) {
    let displayTime = '-';
    if (dto.dispatch_type === 'OT') displayTime = '17.30 น.';
    else if (dto.dispatch_type === 'OT_SPECIAL') displayTime = '21.30 น.';
    else if (dto.dispatch_type === 'NIGHT') displayTime = '07.30 น.';
    else if (dto.dispatch_type === 'HOLIDAY') displayTime = '17.00 น.';

    return `
      <p>เรียน ผู้จัดการ, ซุปเปอร์ไวเซอร์, โฟร์แมน และ AMEC PC USER</p>
      <br>
      <p>ทาง GA ขอแจ้งตารางรถรับส่งพนักงาน OT เวลา ${displayTime} ประจำวันที่ ${dto.display_date_text || dto.workdate || '-'} </p>
      <p>ตามไฟล์แนบดังนี้</p>
      <ul>
        <li>OT Daily Transportation Route</li>
        <li>List of Employee unable arrange transportation </li>
      </ul>
      <br>
      <p>จึงแจ้งมาเพื่อทราบ</p>
      <p>Best regards</p>
      <p>GA Department</p>
    `;
  }
}