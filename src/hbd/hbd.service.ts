import { Injectable } from '@nestjs/common';
import { CreateHbdDto } from './dto/create-hbd.dto';
import { UpdateHbdDto } from './dto/update-hbd.dto';
import { UsersService } from 'src/amec/users/users.service';
import { QrcodeService } from 'src/common/services/qrcode/qrcode.service';
import { MailService } from 'src/common/services/mail/mail.service';
import { now } from 'src/common/utils/dayjs.utils';

@Injectable()
export class HbdService {
  constructor(
    private readonly qrcodeService: QrcodeService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async generateQR() {
    var status = true;
    try {
      const month = now('MM');

      const data = await this.usersService.findBirthday(month);
      console.log(data);

      for (const user of data) {
        const key = `${user.SEMPENCODE}|${user.SEMPNO}`;
        const qrCode = await this.qrcodeService.generateDataURL(key);

        const sendmail = await this.mailService.sendMail({
          from: `AMECHBD <amechbd@mitsubishielevatorasia.co.th>`,
          // to: user.MEMEML,
          subject: 'Happy Birthday from AMEC (คูปองวันเกิด)',
          html: `<p>Dear ${user.SNAME},</p>
          <p>Happy Birthday! As a token of our appreciation, please find your special birthday coupon attached.</p>
          <p>Wishing you a wonderful year ahead!</p>
          <p><img src="${qrCode}" alt="Birthday QR Code"/></p>
          <p>Best Regards,<br/>AMEC</p>`,
        });
      }
    } catch (error) {
      status = false;
      throw new Error(`Failed to generate QR Code: ${error.message}`);
    } finally {
      return { status };
    }
  }
}
