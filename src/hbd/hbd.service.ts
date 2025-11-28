import { Injectable } from '@nestjs/common';
import { CreateHbdDto } from './dto/create-hbd.dto';
import { UpdateHbdDto } from './dto/update-hbd.dto';
import { UsersService } from 'src/amec/users/users.service';
import { QrcodeService } from 'src/common/services/qrcode/qrcode.service';
import { MailService } from 'src/common/services/mail/mail.service';

@Injectable()
export class HbdService {
  constructor(
    private readonly qrcodeService: QrcodeService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async generateQR() {
    await this.mailService.sendMail({
      from: `'AMECHBD' <amechbd@mitsubishielevatorasia.co.th>`,
      // to: user.MEMEML,
      subject: 'Happy Birthday from AMEC (คูปองวันเกิด)',
      html: `<p>Dear Valued AMEC Member,</p>
      <p>Happy Birthday! As a token of our appreciation, please find your special birthday coupon attached.</p>
      <p>Wishing you a wonderful year ahead!</p>
      <p>Best Regards,<br/>AMEC Team</p>`,
    })
    return { qrCode: 'GeneratedQRCodeData' };
  }
}
