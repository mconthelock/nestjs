import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/amec/users/users.service';
import { QrcodeService } from 'src/common/services/qrcode/qrcode.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { now } from 'src/common/utils/dayjs.utils';

import fetch from 'node-fetch';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { ExcelHbdDto, SendQRManualDto } from './dto/hbd.dto';
import { defaultExcel } from 'src/common/utils/exceljs';

@Injectable()
export class HbdService {
  constructor(
    private readonly qrcodeService: QrcodeService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}
  private readonly GOOGLE_SCRIPT_URL: string = process.env.HBD_SCRIPT_URL ||
    'https://script.google.com/macros/s/AKfycbxKsd5Iy8GbKqYDZ3MFfh1rFkJOgutVpIr8we1dARuka7i1cDYBuaSU4Q3pSqIlszhAOA/exec';

  private readonly html = (body: string) => `<!DOCTYPE html>
			<html lang="th">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>AMEC HBD</title>
					<style>
						body {
								font-family: Angsana New, Tahoma, Verdana, Arial, Helvetica, sans-serif;
								font-size: 22px;
								line-height: 1.6;
								color: #333;
								margin: 20px;
						}

						p {
								margin-bottom: 15px;
						}

						div {
								margin-bottom: 20px;
						}
					</style>
				</head>
				<body>
					${body}
				</body>
			</html>`;

  //prettier-ignore
  async sendQR(insert: boolean = true, sendQR: boolean = true, sendReport: boolean = true, month: string = now('MM')) {
    var status = true;
    var message = 'Insert user to Google Sheet successfully';
    const log = [];
    var data = [];
    const year = Number(now('YYYY'))
    try {
      log.push(`Start send QR Code at ${now('DD/MM/YYYY HH:mm:ss')}`);
      log.push(`================================================`);
      const users = await this.usersService.findBirthday(month);
      if (users.length === 0) {
        log.push(`No birthdays found for month: ${month}`);
        throw new Error(`No birthdays found for month: ${month}`);
      }
      log.push(`Found ${users.length} users with birthdays in month: ${month}`);
      data = users;

      // backup sheet
      if(Number(month) == 1){
        log.push(`================================================`);
        log.push(`Backing up Google Sheet for year: ${year - 1}...`);
        const bk = await this.callGoogleScript({
          action: 'backup',
          year: year,
        });
        if (bk && !bk.status) {
          log.push(`Failed to backup Google Sheet: ${bk.message}`);
        }else{
          log.push(`Backup Google Sheet for year: ${year - 1} completed successfully`);
        }
        log.push(`================================================`);
      }

      // insert user to Google Sheet
      if (insert) {
        log.push(`Inserting users to Google Sheet...`);
        const res = await this.callGoogleScript({
          action: 'insert',
          data: users,
          month: month,
          year: year,
        });
        if (res && !res.status) {
          log.push(`Failed to insert user to Google Sheet: ${res.message}`);
          throw new Error(
            `Failed to insert user to Google Sheet: ${res.message}`,
          );
        }
        data = res.data;
        log.push(`Inserted ${res.data.length} users to Google Sheet successfully`);
        log.push(`================================================`);
      }

      // send QR to users
      if(sendQR){
        log.push(`Sending QR Codes to users...`);
        let count = 0;
        for (const user of data) {
          log.push(`${++count}. Sent QR Code to EMPNO: ${user.SEMPNO} started`);
          await this.sendMailQR(user, log);
          log.push(`--------------`);
        }
        log.push(`Sent QR Codes to ${data.length} users successfully`);
        log.push(`================================================`);
        message = `Send QR Code to ${data.length} users successfully`;
      }

      // send report to HR
      if(sendReport){
        log.push(`Sending report to HR...`);
        await this.sendReport({
          month: Number(month) == 1 ? 12 : Number(month) - 1,
          // month: Number(1) == 1 ? 12 : Number(month) - 1, // test for January
          year: year,
          empno: '02013', // HR empno
        }, log);
        message = `Send report to HR successfully`;
      }
    } catch (error) {
      status = false;
      message = error.message;
      log.push(`Error: ${error.message}`);
      throw new Error(`Failed to send QR Code: ${error.message}`);
    } finally {
      log.push(`=================================================`);
      log.push(`Finished send QR Code at ${now('DD/MM/YYYY HH:mm:ss')}`);
      const logContent = log.join('<br>');
      await this.mailService.sendMail({
      from: `AMECHBD <amechbd@mitsubishielevatorasia.co.th>`,
      to: process.env.MAIL_ADMIN,
      subject: `Happy Birthday from AMEC (Log) : ${now('DD/MM/YYYY HH:mm:ss')}`,
      html: this.html(`<h1>Log รายการส่งคูปองวันเกิดพนักงาน</h1><div>${logContent}</div>`),
    });
      return { status, message };
    }
  }

  async sendQRManual(dto: SendQRManualDto) {
    const { empno, insert } = dto;
    var status = true;
    var message = 'Insert user to Google Sheet successfully';
    try {
      const users = await this.usersService.findEmp(empno);
      if (!users) {
        throw new Error(`Employee number ${empno} not found`);
      }
      if (insert) {
        const res = await this.callGoogleScript({
          action: 'insert',
          data: [users],
        });
        if (res && !res.status) {
          throw new Error(
            `Failed to insert user to Google Sheet: ${res.message}`,
          );
        }
      }
      await this.sendMailQR(users);
      message = 'Send QR Code successfully';
    } catch (error) {
      status = false;
      message = error.message;
      throw new Error(`Failed to send QR Code: ${error.message}`);
    } finally {
      return { status, message };
    }
  }

  //prettier-ignore
  async sendReport(dto: ExcelHbdDto, log?: string[]) {
    const { month, year, empno } = dto;
    try {
      const user = await this.usersService.findEmp(empno);
      if (!user) {
        throw new Error(`Employee number ${empno} not found`);
      }
      const res = await this.callGoogleScript({
        action: 'get',
        month: month,
        year: year,
      });
      if (!res || !res.status) {
        log?.push(`Failed to retrieve data: ${res ? res.message : 'No data returned'}`);
        throw new Error(
          `Failed to retrieve data: ${res ? res.message : 'No data returned'}`,
        );
      }
      log?.push(`Retrieved ${res.data.length} records for month: ${month}, year: ${year}`);
      const wk = await defaultExcel({
        data: res.data,
        column: [
            { header: "รหัสพนักงาน", key: "EMPNO", width: 15 },
            { header: "ชื่อ-สกุล", key: "NAME", width: 30 },
            { header: "วันที่ใช้", key: "USEDATE", width: 15, type: "date", numFmt: "dd/mm/yyyy hh:mm:ss" },
        ]
      });
        const buffer = await wk.xlsx.writeBuffer();
        res.attachments = [
            {
                filename: `AMEC_HBD_Report_${month}_${year}.xlsx`,
                content: buffer,
                // encoding: 'base64',
                // contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            },
        ];
      await this.sendMailReport(user, res.attachments, month, year, log);
      log.push(`Sent report to HR successfully`);
      return { status: true, message: 'Send report successfully', user, data: res.data };
    } catch (error) {
      throw new Error(`Failed to Send report: ${error.message}`);
    }
  }

  //prettier-ignore
  async sendMailReport( user: any, attachments: any, month: number, year: number, log?: string[]) {
    const name = user.STNAME;
    const email = user.SRECMAIL;
    try{
      const sendmail = await this.mailService.sendMail({
        from: `AMECHBD <amechbd@mitsubishielevatorasia.co.th>`,
        // to: email,
        subject: `Happy Birthday from AMEC (รายงาน) ประจำเดือน ${month} ปี ${year}`,
        html: this.html(`<p>เรียน คุณ ${name}</p>
        <div>ตามที่ท่านได้ทำการร้องขอรายงานข้อมูลวันเกิดพนักงานผ่านระบบ AMEC HBD เราขอส่งรายงานดังกล่าวมาให้ท่านตามไฟล์แนบในอีเมลนี้<br> หากท่านมีคำถามหรือข้อสงสัยเพิ่มเติมเกี่ยวกับรายงานนี้ กรุณาติดต่อผู้ดูแลระบบ เพื่อขอความช่วยเหลือ</div>
        <b>ขอแสดงความนับถือ</b>
              <br>
        <b>จดหมายอิเล็กทรอนิกส์ฉบับนี้ เป็นการส่งจากระบบอัตโนมัติ ไม่สามารถตอบกลับได้ หากท่านมีข้อสงสัยหรือต้องการสอบถามรายละเอียดเพิ่มเติม โปรดติดต่อผู้ดูแลระบบ โทร.2038 </b>`),
        attachments: attachments,
      });
      log?.push(`Email sent to ${user.SEMPNO} ${name} (${email})`);
    }catch (error) {
      log?.push(`Failed to send report to ${user.SEMPNO} ${name} (${email}): ${error.message}`);
      throw new Error(
        `Failed to send report to ${user.SEMPNO}: ${error.message}`,
      );
    }
  }

  //prettier-ignore
  async sendMailQR(user: any, log?: string[]) {
    const key = `${user.SEMPENCODE}|${user.SEMPNO}|${Number(String(user.BIRTHDAY).substring(4,6))}`;
    const name = user.STNAME;
    const email = user.MEMEML;
    try {
      const qrCode = await this.qrcodeService.generateDataURL(key);
      const sendmail = await this.mailService.sendMail({
        from: `AMECHBD <amechbd@mitsubishielevatorasia.co.th>`,
        // to: email,
        subject: 'Happy Birthday from AMEC (คูปองวันเกิด)',
        html: this.html(`<p>เรียน คุณ ${name}</p>
        <p>สุขสันต์วันเกิด! ขอให้มีความสุขมากๆ ในวันพิเศษนี้ ทาง AMEC ขอส่งคูปองวันเกิดพิเศษให้ท่านตามไฟล์แนบในอีเมลนี้</p>
        <p>ขอให้ท่านมีความสุขในปีที่จะมาถึง!</p>
        <p><img src="${qrCode}" alt="Birthday QR Code" /></p>
        <b>ขอแสดงความนับถือ</b>
        <p>หมายเหตุ :</p>
        <ul>
            <li>คูปองวันเกิดนี้มีมูลค่า 25 บาท</li>
            <li>สามารถใช้คูปองนี้ได้ที่ร้านค้าที่ร่วมรายการเท่านั้น ร้าน Sleep less</li>
            <li>คูปองนี้สามารถใช้ได้ภายในเดือนเกิดของท่าน</li>
            <li>สิทธิพิเศษนี้ไม่สามารถแลกเปลี่ยนเป็นเงินสดหรือของรางวัลอื่นๆ ได้</li>
        </ul>
        <b>จดหมายอิเล็กทรอนิกส์ฉบับนี้ เป็นการส่งจากระบบอัตโนมัติ ไม่สามารถตอบกลับได้ หากท่านมีข้อสงสัยหรือต้องการสอบถามรายละเอียดเพิ่มเติม โปรดติดต่อฝ่ายทรัพยากรบุคคล </b>`),
        attachments: [
          {
            filename: 'AMEC Birthday QR Code.png',
            content: qrCode.split(',')[1], // ตัดเอาเฉพาะ base64 string
            encoding: 'base64',
          },
        ],
      });
      log?.push(`Email sent to ${user.SEMPNO} ${name} (${email})`);
    } catch (error) {
      log?.push(`Failed to send email to ${user.SEMPNO} ${name} (${email}): ${error.message}`);
      throw new Error(
        `Failed to send email to ${user.SEMPNO}: ${error.message}`,
      );
    }
  }

  //prettier-ignore
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
