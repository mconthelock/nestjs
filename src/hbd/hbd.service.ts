import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/amec/users/users.service';
import { QrcodeService } from 'src/common/services/qrcode/qrcode.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { now } from 'src/common/utils/dayjs.utils';

import fetch from 'node-fetch';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { ExcelHbdDto } from './dto/hbd.dto';

@Injectable()
export class HbdService {
  constructor(
    private readonly qrcodeService: QrcodeService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}
  private readonly GOOGLE_SCRIPT_URL: string =
    'https://script.google.com/macros/s/AKfycbxKsd5Iy8GbKqYDZ3MFfh1rFkJOgutVpIr8we1dARuka7i1cDYBuaSU4Q3pSqIlszhAOA/exec';

  async generateQR() {
    var status = true;
    var message = 'Insert user to Google Sheet successfully';
    try {
      const month = now('MM');

      const data = await this.usersService.findBirthday(month);
      if (data.length === 0) {
        throw new Error(`No birthdays found for month: ${month}`);
      }
      const insertUser = await this.callGoogleScript({
        action: 'insert',
        data: data,
      });
      if (insertUser && !insertUser.status) {
        throw new Error(
          `Failed to insert user to Google Sheet: ${insertUser.message}`,
        );
      }

      for (const user of data) {
        await this.sendMailQR(user);
      }
    } catch (error) {
      status = false;
      message = error.message;
      throw new Error(`Failed to generate QR Code: ${error.message}`);
    } finally {
      return { status, message };
    }
  }

  async sendReport(dto: ExcelHbdDto) {
    const { month, year, empno } = dto;
    try {
      const user = await this.usersService.findEmp(empno);
      if (!user) {
        throw new Error(`Employee number ${empno} not found`);
      }
      const data = await this.callGoogleScript({
        action: 'get',
        month: month,
        year: year,
      });
      if (!data || !data.status) {
        throw new Error(
          `Failed to retrieve data: ${data ? data.message : 'No data returned'}`,
        );
      }
      return { data, user };
    } catch (error) {
      throw new Error(`Failed to Export excel: ${error.message}`);
    }
  }

  async sendMailReport(user: any) {
    const email = user.SRECMAIL;
    const name = user.STNAME;
    const sendmail = await this.mailService.sendMail({
      from: `AMECHBD <amechbd@mitsubishielevatorasia.co.th>`,
      to: email,
      subject: 'Happy Birthday from AMEC (คูปองวันเกิด)',
      html: `<p>Dear ${name},</p>
					<p>Happy Birthday! As a token of our appreciation, please find your special birthday coupon attached.</p>
					<p>Wishing you a wonderful year ahead!</p>`,
    });
  }

  async sendMailQR(user: any) {
    const key = `${user.SEMPENCODE}|${user.SEMPNO}`;
    const name = user.STNAME;
    const email = user.MEMEML;
    const qrCode = await this.qrcodeService.generateDataURL(key);
    const sendmail = await this.mailService.sendMail({
      from: `AMECHBD <amechbd@mitsubishielevatorasia.co.th>`,
      // to: email,
      subject: 'Happy Birthday from AMEC (คูปองวันเกิด)',
      html: `<p>Dear ${name},</p>
          <p>Happy Birthday! As a token of our appreciation, please find your special birthday coupon attached.</p>
          <p>Wishing you a wonderful year ahead!</p>
          <p><img src="${qrCode}" alt="Birthday QR Code"/></p>
          <p>Best Regards,<br/>AMEC</p>`,
      attachments: [
        {
          filename: 'AMEC Birthday QR Code.png',
          content: qrCode.split(',')[1], // ตัดเอาเฉพาะ base64 string
          encoding: 'base64',
        },
      ],
    });
  }

  async callGoogleScript(params: any): Promise<any> {
    try {
      const agent = new HttpsProxyAgent(process.env.HTTP_PROXY);
      const res = await fetch(this.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        agent,
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return await res.json();
    } catch (error) {
      throw new Error(`Failed to call Google Script: ${error.message}`);
    }
  }
}
