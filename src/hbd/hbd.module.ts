import { Module } from '@nestjs/common';
import { HbdService } from './hbd.service';
import { HbdController } from './hbd.controller';
import { QrcodeModule } from 'src/common/services/qrcode/qrcode.module';
import { UsersModule } from 'src/amec/users/users.module';
import { MailModule } from 'src/common/services/mail/mail.module';

@Module({
  imports: [QrcodeModule, UsersModule, MailModule],
  controllers: [HbdController],
  providers: [HbdService],
})
export class HbdModule {}
